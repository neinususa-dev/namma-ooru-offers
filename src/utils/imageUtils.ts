export const resizeImage = (file: File, maxWidth: number = 300, maxHeight: number = 200, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and resize image
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to base64
      const resizedImage = canvas.toDataURL('image/jpeg', quality);
      resolve(resizedImage);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const generateDefaultImage = (storeName: string, width: number = 300, height: number = 200): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  if (ctx) {
    // Create gradient background with proper colors
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#6366f1'); // Primary color
    gradient.addColorStop(1, '#4f46e5'); // Darker primary
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add store name text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Wrap text if too long
    const maxWidth = width - 40;
    const words = storeName.split(' ');
    let line = '';
    let y = height / 2;
    
    if (ctx.measureText(storeName).width <= maxWidth) {
      ctx.fillText(storeName, width / 2, y);
    } else {
      // Split into multiple lines
      const lines = [];
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      const lineHeight = 30;
      y = (height - (lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((textLine, index) => {
        ctx.fillText(textLine.trim(), width / 2, y + index * lineHeight);
      });
    }
  }
  
  return canvas.toDataURL('image/jpeg', 0.8);
};