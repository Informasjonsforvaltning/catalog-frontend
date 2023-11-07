import { localization } from '../language/localization';

export const validateImageFile = (file: File | null): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(false);
      return;
    }
    if (!RegExp(/\.(svg|png)$/).exec(file.name)) {
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
        alert(localization.alert.fileNotValid);
        resolve(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
