let cam;

//Make texts face the camera
function faceCamera(px, py, pz, cam) {

  // Vector from text to camera
  let dx = cam.eyeX - px;
  let dy = cam.eyeY - py;
  let dz = cam.eyeZ - pz;

  // Yaw (around Y axis)
  let yaw = atan2(dx, dz);

  // Pitch (around X axis)
  let distXZ = sqrt(dx * dx + dz * dz);
  let pitch = atan2(dy, distXZ);

  // Apply rotation
  rotateY(yaw);
  rotateX(-pitch);

}