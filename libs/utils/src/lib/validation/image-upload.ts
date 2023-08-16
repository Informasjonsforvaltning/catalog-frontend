export const validateImageFile = (file: File | null): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(false);
      return;
    }
    if (!file.name.match(/\.(svg|png)$/)) {
      resolve(false);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(true); // Image content is valid
      };
      img.onerror = () => {
        alert('The content of the file is not valid.');
        resolve(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
