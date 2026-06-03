import { useState, useRef, useEffect } from "react";

/* Cropper.js is loaded via CDN script tag in index.html — accessed as window.Cropper */

export default function PhotoUpload() {
  const [stage, setStage] = useState("pick"); // "pick" | "crop" | "success"
  const [uploaderName, setUploaderName] = useState("");
  const [aspectLabel, setAspectLabel] = useState("Square");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const cropperRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const zoomSliderRef = useRef(null);
  const lastZoomRef = useRef(0);

  const ASPECT_RATIOS = {
    Square: 1,
    "4:3": 4 / 3,
    "3:4": 3 / 4,
    Free: NaN,
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cropperRef.current) cropperRef.current.destroy();
    };
  }, []);

  // Initialize Cropper AFTER React has rendered the <img> element into the DOM
  useEffect(() => {
    if (stage !== "crop" || !imageSrc || !imgRef.current) return;

    if (!window.Cropper) {
      showToast("⚠️ Cropper failed to load. Please refresh and try again.");
      return;
    }

    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }

    const timer = setTimeout(() => {
      cropperRef.current = new window.Cropper(imgRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: "move",
        autoCropArea: 0.9,
        background: false,
        responsive: true,
        zoom(e) {
          if (!zoomSliderRef.current) return;
          let v =
            parseFloat(zoomSliderRef.current.value) +
            (e.detail.ratio - e.detail.oldRatio);
          zoomSliderRef.current.value = Math.max(-0.5, Math.min(1.5, v));
        },
      });
      if (zoomSliderRef.current) zoomSliderRef.current.value = 0;
      setAspectLabel("Square");
    }, 50);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, imageSrc]);

  function showToast(msg, duration = 3200) {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }

  function loadImage(file) {
    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
      lastZoomRef.current = 0;
      // Store src in state so React renders <img> first, then useEffect initialises Cropper
      setImageSrc(ev.target.result);
      setStage("crop");
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    if (e.target.files?.[0]) loadImage(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadImage(f);
  }

  function handleAspect(label) {
    setAspectLabel(label);
    cropperRef.current?.setAspectRatio(ASPECT_RATIOS[label]);
  }

  function handleZoomSlider(e) {
    if (!cropperRef.current) return;
    const v = parseFloat(e.target.value);
    cropperRef.current.zoom(v - lastZoomRef.current);
    lastZoomRef.current = v;
  }

  function cancelCrop() {
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
    if (fileInputRef.current) fileInputRef.current.value = "";
    lastZoomRef.current = 0;
    setImageSrc(null);
    setStage("pick");
  }

  function uploadAnother() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploaderName("");
    lastZoomRef.current = 0;
    setImageSrc(null);
    setStage("pick");
  }

  async function handleUpload() {
    if (!cropperRef.current) return;
    setIsUploading(true);

    try {
      const canvas = cropperRef.current.getCroppedCanvas({
        maxWidth: 2000,
        maxHeight: 2000,
        imageSmoothingQuality: "high",
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const base64 = dataUrl.split(",")[1];

      const name = (uploaderName.trim() || "photo")
        .replace(/[^a-z0-9_\- ]/gi, "")
        .replace(/\s+/g, "_");
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      const filename = `${name}_${ts}.jpg`;

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType: "image/jpeg", filename }),
      });

      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.ok === false) throw new Error(out.error || "Upload failed");

      if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
      lastZoomRef.current = 0;
      setStage("success");
      showToast("✅ Uploaded successfully!");
    } catch (err) {
      showToast(`❌ Upload failed: ${err.message || err}`);
      console.error(err);
    }

    setIsUploading(false);
  }

  return (
    <>
      {/* Cropper.js CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css"
      />

      <style>{`
        .pu-body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #406AAF 0%, #2d4f8a 100%);
          min-height: 100vh;
          color: #334155;
        }
        .pu-header {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding: 1.25rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .pu-logo { font-size:1.5rem; font-weight:900; color:#F7DD7D; letter-spacing:0.15em; }
        .pu-header h1 { font-size:1rem; font-weight:600; color:rgba(255,255,255,0.85); letter-spacing:0.1em; }
        .pu-container { max-width:640px; margin:0 auto; padding:2rem 1.5rem 4rem; display:flex; flex-direction:column; gap:1.25rem; }
        .pu-card { background:#fff; border-radius:2rem; box-shadow:0 8px 32px rgba(0,0,0,0.18); padding:2rem; }
        .pu-card h2 { font-size:1.4rem; font-weight:800; color:#406AAF; margin-bottom:0.4rem; }
        .pu-subtitle { font-size:0.82rem; color:#64748b; margin-bottom:1.5rem; line-height:1.5; }
        .pu-label { display:block; font-size:0.78rem; font-weight:700; letter-spacing:0.08em; color:#406AAF; margin-bottom:0.35rem; text-transform:uppercase; }
        .pu-input {
          width:100%; border:1.5px solid #e2e8f0; border-radius:0.85rem;
          padding:0.65rem 0.85rem; font-size:0.9rem; font-family:'Inter',sans-serif;
          color:#334155; outline:none; transition:border-color 0.2s; margin-bottom:1rem;
        }
        .pu-input:focus { border-color:#406AAF; }
        .pu-drop {
          border:2px dashed #c7d2fe; border-radius:1rem; padding:1.75rem;
          text-align:center; cursor:pointer; transition:border-color 0.2s, background 0.2s;
          margin-bottom:1rem; background:#f8faff;
        }
        .pu-drop:hover, .pu-drop.dragging { border-color:#406AAF; background:#eef2ff; }
        .pu-drop .icon { font-size:2rem; margin-bottom:0.5rem; }
        .pu-drop p { font-size:0.82rem; color:#64748b; margin:0; }
        .pu-drop p strong { color:#406AAF; }
        .pu-btn {
          width:100%; background:#406AAF; color:#fff; border:none;
          border-radius:0.85rem; padding:0.8rem; font-size:0.85rem; font-weight:700;
          letter-spacing:0.12em; cursor:pointer; text-transform:uppercase;
          transition:background 0.2s, transform 0.15s;
        }
        .pu-btn:hover:not(:disabled) { background:#427AB5; transform:translateY(-1px); }
        .pu-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .pu-btn-sec {
          width:100%; background:#eef2ff; color:#406AAF; border:none;
          border-radius:0.85rem; padding:0.8rem; font-size:0.85rem; font-weight:700;
          letter-spacing:0.12em; cursor:pointer; text-transform:uppercase; transition:background 0.2s;
        }
        .pu-btn-sec:hover { background:#e0e7ff; }
        .pu-crop-wrap { width:100%; max-height:380px; background:#0f172a; border-radius:1rem; overflow:hidden; margin-bottom:1rem; }
        .pu-crop-wrap img { display:block; max-width:100%; }
        .pu-aspects { display:flex; gap:0.4rem; margin-bottom:1rem; justify-content:center; flex-wrap:wrap; }
        .pu-aspect-btn {
          background:#f1f5f9; color:#64748b; border:1.5px solid #e2e8f0; border-radius:999px;
          padding:0.35rem 0.9rem; font-size:0.75rem; font-weight:700; cursor:pointer;
          letter-spacing:0.05em; transition:all 0.15s;
        }
        .pu-aspect-btn.active { background:#406AAF; color:#fff; border-color:#406AAF; }
        .pu-zoom-row { display:flex; align-items:center; gap:0.6rem; width:100%; margin-bottom:1rem; }
        .pu-zoom-row span { font-size:1.1rem; }
        .pu-zoom-row input[type=range] { flex:1; accent-color:#406AAF; cursor:pointer; }
        .pu-tools { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem; align-items:center; justify-content:center; }
        .pu-tool {
          background:#F7DD7D; color:#406AAF; border:none; border-radius:0.6rem;
          min-width:44px; height:40px; padding:0 0.65rem; font-weight:700; cursor:pointer;
          font-size:0.85rem; transition:all 0.15s;
        }
        .pu-tool:hover { background:#ffd700; transform:translateY(-1px); }
        .pu-tool.ghost { background:#eef2ff; }
        .pu-tool.ghost:hover { background:#e0e7ff; }
        .pu-hint { font-size:0.75rem; color:#94a3b8; text-align:center; margin-bottom:1rem; }
        .pu-actions { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
        .pu-success { text-align:center; padding:1rem 0; }
        .pu-success .check { font-size:3rem; margin-bottom:0.5rem; }
        .pu-success h3 { color:#16a34a; font-size:1.2rem; font-weight:800; margin-bottom:0.3rem; }
        .pu-success p { color:#64748b; font-size:0.85rem; margin-bottom:1.25rem; }
        .pu-toast {
          position:fixed; bottom:2rem; right:2rem; left:2rem; max-width:360px; margin:0 auto;
          background:#1e293b; color:white; padding:0.85rem 1.5rem; border-radius:1rem;
          font-size:0.85rem; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,0.25);
          z-index:999; text-align:center; animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div className="pu-body">
        <header className="pu-header">
          <div className="pu-logo">MTC</div>
          <h1>Photo Upload</h1>
        </header>

        <div className="pu-container">
          <div className="pu-card">
            <h2>📸 Upload Your Photo</h2>
            <p className="pu-subtitle">
              Pick a photo, crop and zoom it, then submit. Your photo goes straight to the MTC team.
            </p>

            {/* ── STEP 1: Pick ── */}
            {stage === "pick" && (
              <div>
                <label className="pu-label">
                  Your Name{" "}
                  <span style={{ textTransform: "none", color: "#94a3b8", fontWeight: 500 }}>
                    (optional)
                  </span>
                </label>
                <input
                  className="pu-input"
                  type="text"
                  placeholder="e.g. Ahad Ahmed"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                />

                <label className="pu-label">Choose a Photo</label>
                <div
                  className={`pu-drop${isDragging ? " dragging" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <div className="icon">📷</div>
                  <p><strong>Click to choose</strong> or drag &amp; drop</p>
                  <p>PNG, JPG, WEBP — one photo at a time</p>
                </div>
              </div>
            )}

            {/* ── STEP 2: Crop ── */}
            {stage === "crop" && (
              <div>
                <div className="pu-aspects">
                  {Object.keys(ASPECT_RATIOS).map((label) => (
                    <button
                      key={label}
                      className={`pu-aspect-btn${aspectLabel === label ? " active" : ""}`}
                      onClick={() => handleAspect(label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="pu-crop-wrap">
                  <img ref={imgRef} src={imageSrc} alt="Crop preview" />
                </div>

                <div className="pu-zoom-row">
                  <span title="Zoom out">🔍−</span>
                  <input
                    ref={zoomSliderRef}
                    type="range"
                    min="-0.5"
                    max="1.5"
                    step="0.01"
                    defaultValue="0"
                    onChange={handleZoomSlider}
                  />
                  <span title="Zoom in">🔍+</span>
                </div>

                <div className="pu-tools">
                  <button className="pu-tool" onClick={() => cropperRef.current?.zoom(0.1)}>＋</button>
                  <button className="pu-tool" onClick={() => cropperRef.current?.zoom(-0.1)}>－</button>
                  <button className="pu-tool ghost" onClick={() => cropperRef.current?.rotate(-90)}>↺</button>
                  <button className="pu-tool ghost" onClick={() => cropperRef.current?.rotate(90)}>↻</button>
                  <button className="pu-tool ghost" onClick={() => { cropperRef.current?.reset(); if (zoomSliderRef.current) zoomSliderRef.current.value = 0; lastZoomRef.current = 0; }}>Reset</button>
                </div>

                <p className="pu-hint">Drag the image to reposition · drag box edges to resize</p>

                <div className="pu-actions">
                  <button className="pu-btn-sec" onClick={cancelCrop}>↩ Change Photo</button>
                  <button className="pu-btn" onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Uploading…" : "⬆ Upload"}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Success ── */}
            {stage === "success" && (
              <div className="pu-success">
                <div className="check">✅</div>
                <h3>Photo uploaded!</h3>
                <p>Thank you — your photo has been sent to the MTC team.</p>
                <button className="pu-btn" onClick={uploadAnother}>Upload Another</button>
              </div>
            )}
          </div>
        </div>

        {toast && <div className="pu-toast">{toast}</div>}
      </div>
    </>
  );
}
