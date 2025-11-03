
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // The result includes a data URL prefix like "data:audio/webm;base64,". We need to remove it.
      const content = base64String.split(',')[1];
      resolve(content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
