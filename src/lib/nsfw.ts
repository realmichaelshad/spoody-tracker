/**
 * Client-side NSFW screening. The MobileNetV2 model ships INSIDE the nsfwjs
 * package (no CDN, works offline); it and tfjs are lazy-loaded ONLY when a
 * user attaches a photo — text reports never pay this cost. If the scanner
 * can't load, photo attaching is disabled (text-only reports always work).
 */
let modelPromise: Promise<any> | null = null;

async function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      /* nsfwjs/core is model-free; importing ONLY the MobileNetV2 definition
         keeps the other bundled models (~35MB) out of the build entirely. */
      const [core, tf, { MobileNetV2Model }] = await Promise.all([
        import('nsfwjs/core'),
        import('@tensorflow/tfjs'),
        import('nsfwjs/models/mobilenet_v2'),
      ]);
      await tf.ready();
      return core.load('MobileNetV2', { modelDefinitions: [MobileNetV2Model] } as any);
    })();
    /* A failed load must not poison future attempts (e.g. flaky network). */
    modelPromise.catch(() => {
      modelPromise = null;
    });
  }
  return modelPromise;
}

export interface ScreenResult {
  ok: boolean;
  reason?: 'unsafe' | 'scanner-offline';
}

const THRESHOLDS: Record<string, number> = {
  Porn: 0.7,
  Hentai: 0.7,
  Sexy: 0.85,
};

/** Returns ok=false with reason 'unsafe' if the image trips the filter. */
export async function screenImage(blob: Blob): Promise<ScreenResult> {
  let model: any;
  try {
    model = await loadModel();
  } catch {
    return { ok: false, reason: 'scanner-offline' };
  }
  try {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
    bitmap.close();
    const predictions: Array<{ className: string; probability: number }> =
      await model.classify(canvas);
    for (const p of predictions) {
      const limit = THRESHOLDS[p.className];
      if (limit !== undefined && p.probability > limit) {
        return { ok: false, reason: 'unsafe' };
      }
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'scanner-offline' };
  }
}
