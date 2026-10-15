import cv2
import numpy as np
import os
import sys

# Ensure UTF-8 output encoding for stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Setup paths
output_dir = 'public/assets'
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, 'petjanu-story.mp4')

# Video settings (1080p, 30fps, 15 seconds total)
width, height = 1920, 1080
fps = 30
scene_duration = 5 
frames_per_scene = fps * scene_duration

# Initialize Video Writer
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_file, fourcc, fps, (width, height))

def create_gradient(color1, color2):
    """Creates a smooth vertical gradient"""
    gradient = np.zeros((height, width, 3), dtype=np.uint8)
    for i in range(height):
        ratio = i / height
        # BGR format for OpenCV
        b = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        r = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        gradient[i, :] = [b, g, r] 
    return gradient

print("Scene 1: Generating 'The Fear' (Dark/Anxious)...")
grad1 = create_gradient((20, 10, 10), (0, 0, 0)) # Dark red/black tint
for i in range(frames_per_scene):
    frame = grad1.copy()
    alpha = 1.0 - (i / frames_per_scene) * 0.7 # Slowly fades darker
    frame = cv2.convertScaleAbs(frame, alpha=alpha)
    out.write(frame)

print("Scene 2: Generating 'The Alert' (Cyan Radar Pulse)...")
grad2 = create_gradient((30, 40, 20), (5, 15, 10)) # Deep Pine Green
for i in range(frames_per_scene):
    frame = grad2.copy()
    # Expanding Cyan Radar Rings
    radius = int((i / frames_per_scene) * 800)
    cv2.circle(frame, (width//2, height//2), radius, (212, 182, 6), 4) # Cyan BGR
    cv2.circle(frame, (width//2, height//2), int(radius * 0.6), (212, 182, 6), 2)
    out.write(frame)

print("Scene 3: Generating 'The Reunion' (Warm Amber Glow)...")
grad3 = create_gradient((0, 100, 200), (0, 50, 150)) # Warm Amber/Gold BGR
# Create a soft glowing center mask
glow_mask = np.zeros((height, width), dtype=np.uint8)
cv2.circle(glow_mask, (width//2, height//2), 500, 255, -1)
glow_mask = cv2.GaussianBlur(glow_mask, (201, 201), 0)
glow_color = np.zeros((height, width, 3), dtype=np.uint8)
glow_color[:, :] = (0, 180, 255) # Bright Amber BGR

for i in range(frames_per_scene):
    frame = grad3.copy()
    # Breathing/Pulsing effect
    pulse_intensity = 0.4 + 0.3 * np.sin(i / 5) 
    overlay = cv2.multiply(glow_color, np.array([pulse_intensity]))
    overlay_masked = cv2.bitwise_and(overlay, overlay, mask=glow_mask)
    frame = cv2.add(frame, overlay_masked)
    out.write(frame)

out.release()
print(f"\nSUCCESS! Cinematic video generated at: {output_file}")
print("Agent task complete. Video is ready for your React component!")
