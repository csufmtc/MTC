/**
 * MTC Photo Upload — Google Apps Script
 * ────────────────────────────────────────────────────────────────
 * SETUP STEPS (do this once):
 *
 *  1. Go to https://script.google.com  → New Project
 *  2. Paste this entire file into the editor (replace the default code)
 *  3. Click "Deploy" → "New deployment"
 *  4. Type: Web app
 *     Execute as: Me
 *     Who has access: Anyone
 *  5. Click "Deploy" and copy the Web App URL
 *  6. Paste that URL into photo-upload.html where it says PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
 *
 * The script saves uploaded photos to the Google Drive folder below.
 * ────────────────────────────────────────────────────────────────
 */

// ← Your Google Drive folder ID (the part after /folders/ in the URL)
const DRIVE_FOLDER_ID = "18lsUwtGRwfh8w2L13c7BeC4m568_tzPe";

/**
 * Handles POST requests from the photo-upload page.
 * Expects JSON body: { image: "<base64>", mimeType: "image/jpeg", filename: "name.jpg" }
 */
function doPost(e) {
  try {
    // Parse the incoming JSON (sent as text/plain to avoid CORS preflight)
    const data = JSON.parse(e.postData.contents);

    if (!data.image) {
      return jsonResponse({ ok: false, error: "No image data received" });
    }

    // Decode base64 → binary blob
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.image),
      data.mimeType || "image/jpeg",
      data.filename  || ("mtc_photo_" + new Date().getTime() + ".jpg")
    );

    // Save to Google Drive
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const file   = folder.createFile(blob);

    // Make the file viewable by anyone with the link (optional)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return jsonResponse({
      ok: true,
      fileId:   file.getId(),
      filename: file.getName(),
      viewUrl:  file.getUrl()
    });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

/**
 * Handles GET requests (used to test that the script is deployed correctly).
 */
function doGet() {
  return jsonResponse({ ok: true, message: "MTC Photo Upload endpoint is live ✅" });
}

/** Helper: return JSON with proper CORS headers */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
