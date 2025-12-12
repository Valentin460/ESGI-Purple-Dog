import { ref, onBeforeUnmount } from 'vue';

export function useCamera() {
  const videoRef = ref(null);
  const isCameraOpen = ref(false);
  const cameraError = ref('');
  let mediaStream = null;

  const startCamera = async () => {
    cameraError.value = '';
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraError.value = 'La caméra n\'est pas disponible sur cet appareil ou ce navigateur.';
        return;
      }
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.value) {
        videoRef.value.srcObject = mediaStream;
        await videoRef.value.play();
      }
      isCameraOpen.value = true;
    } catch (err) {
      cameraError.value = 'Impossible d\'activer la caméra. Vérifiez les permissions navigateur.';
      console.error('Camera error', err);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
    if (videoRef.value) {
      videoRef.value.srcObject = null;
    }
    isCameraOpen.value = false;
  };

  const captureFromCamera = async (photoPreview, updateFile) => {
    if (!videoRef.value) {
      cameraError.value = 'Erreur: référence vidéo non disponible';
      return;
    }

    try {
      const video = videoRef.value;

      await new Promise(resolve => setTimeout(resolve, 100));

      if (!video.videoWidth || !video.videoHeight) {
        cameraError.value = 'La vidéo n\'est pas encore prête. Attendez un moment et réessayez.';
        console.warn('Video dimensions not ready:', video.videoWidth, video.videoHeight);
        return;
      }

      const canvas = document?.createElement('canvas');
      if (!canvas) {
        cameraError.value = 'Canvas non disponible';
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Impossible d\'obtenir le contexte canvas');
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      photoPreview.value = canvas.toDataURL('image/png');

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'profile.png', { type: 'image/png' });
          updateFile(file);
          cameraError.value = '';
        } else {
          cameraError.value = 'Erreur: impossible de créer l\'image';
        }
      }, 'image/png');

      stopCamera();
    } catch (err) {
      cameraError.value = 'Erreur capture: ' + (err.message || err);
      console.error('Capture error:', err);
    }
  };

  onBeforeUnmount(() => {
    stopCamera();
  });

  return {
    videoRef,
    isCameraOpen,
    cameraError,
    startCamera,
    stopCamera,
    captureFromCamera,
  };
}
