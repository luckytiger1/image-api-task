import './styles/style.scss';

const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

let currentColor;
let sizex1;
let sizex2;
let sizex4;
let pencil;
let bucket;
let colorPicker;
let count = 0;
let isDrawing = false;
let previousCords = null;
let imgWidth;
let imgHeight;

function fillCanvas() {
  context.fillStyle = document.querySelector('.curr-color').style.background;
  context.fillRect(0, 0, 512, 512);
}
const tempCanvas = document.createElement('canvas');
const tempContext = tempCanvas.getContext('2d');

function reSize(w, h) {
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempContext.drawImage(canvas, 0, 0);
  canvas.width = w;
  canvas.height = h;
  context.imageSmoothingEnabled = false;

  context.drawImage(
    tempCanvas,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.fillStyle = document.querySelector('.curr-color').style.background;
}
function drawLine(x0, x1, y0, y1, size) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    context.fillRect(x0 * size, y0 * size, size, size);
    context.fill();

    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      // eslint-disable-next-line no-param-reassign
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      // eslint-disable-next-line no-param-reassign
      y0 += sy;
    }
  }
}
function draw(e, size) {
  const lastX = Math.floor(e.offsetX / size);
  const lastY = Math.floor(e.offsetY / size);
  context.fillRect(lastX * size, lastY * size, size, size);
  context.fill();
}
function pickColor(event, size) {
  const x = event.offsetX;
  const y = event.offsetY;
  const pixel = context.getImageData(x / size, y / size, size, size);
  const { data } = pixel;
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
  document.querySelector('.curr-color').style.background = rgba;
  context.fillStyle = rgba;
}
function saveImage() {
  const imageData = canvas.toDataURL();
  localStorage.setItem('prev-canvas', imageData);
}
function saveColors() {
  const prevColorOld = document.querySelector('.prev-color-btn').style
    .background;
  const currColorOld = document.querySelector('.curr-color').style.background;
  localStorage.setItem('currColorOld', currColorOld);
  localStorage.setItem('prevColorOld', prevColorOld);
}
function saveTool() {
  if (pencil) {
    localStorage.setItem('currTool', 'pencil');
  }
  if (bucket) {
    localStorage.setItem('currTool', 'bucket');
  }
  if (colorPicker) {
    localStorage.setItem('currTool', 'colorPicker');
  }
}
function saveSize() {
  if (sizex4) {
    localStorage.setItem('currSize', 'sizex4');
  }
  if (sizex2) {
    localStorage.setItem('currSize', 'sizex2');
  }
  if (sizex1) {
    localStorage.setItem('currSize', 'sizex1');
  }
}
function showColors() {
  document.querySelector('.curr-color').style.background = localStorage.getItem(
    'currColorOld',
  );
  document.querySelector(
    '.prev-color-btn',
  ).style.background = localStorage.getItem('prevColorOld');
  context.fillStyle = document.querySelector('.curr-color').style.background;
}
function showTool(t) {
  switch (t) {
    case 'pencil': {
      pencil = true;
      const listItems = document.querySelectorAll('.list-item');
      [].forEach.call(listItems, (el) => {
        el.classList.remove('active');
      });
      document.querySelector('.list-item.pencil').classList.add('active');
      break;
    }
    case 'bucket': {
      bucket = true;
      const listItems = document.querySelectorAll('.list-item');
      [].forEach.call(listItems, (el) => {
        el.classList.remove('active');
      });
      document.querySelector('.list-item.bucketBtn').classList.add('active');
      break;
    }
    case 'colorPicker': {
      colorPicker = true;
      const listItems = document.querySelectorAll('.list-item');
      [].forEach.call(listItems, (el) => {
        el.classList.remove('active');
      });
      document
        .querySelector('.list-item.chooseColorBtn')
        .classList.add('active');
      break;
    }
    default:
  }
}
function showSize(s) {
  switch (s) {
    case 'sizex4': {
      sizex4 = true;
      const sizeBtn = document.querySelectorAll('.size-btn');
      [].forEach.call(sizeBtn, (el) => {
        el.classList.remove('active');
      });
      document.querySelector('#small-canvas').classList.add('active');
      break;
    }
    case 'sizex2': {
      sizex2 = true;
      const sizeBtn = document.querySelectorAll('.size-btn');
      [].forEach.call(sizeBtn, (el) => {
        el.classList.remove('active');
      });
      document.querySelector('#medium-canvas').classList.add('active');
      break;
    }
    case 'sizex1': {
      sizex1 = true;
      const sizeBtn = document.querySelectorAll('.size-btn');
      [].forEach.call(sizeBtn, (el) => {
        el.classList.remove('active');
      });
      document.querySelector('#large-canvas').classList.add('active');
      break;
    }
    default:
  }
}
function loadCanvas() {
  if (
    localStorage.getItem('canvasW') === '128' &&
    localStorage.getItem('canvasH') === '128'
  ) {
    canvas.width = 128;
    canvas.height = 128;
  } else if (
    localStorage.getItem('canvasW') === '256' &&
    localStorage.getItem('canvasH') === '256'
  ) {
    canvas.width = 256;
    canvas.height = 256;
  } else if (
    localStorage.getItem('canvasW') === '512' &&
    localStorage.getItem('canvasH') === '512'
  ) {
    canvas.width = 512;
    canvas.height = 512;
  } else {
    canvas.width = 128;
    canvas.height = 128;
  }

  const currSize = localStorage.getItem('currSize');
  const currTool = localStorage.getItem('currTool');

  showSize(currSize);
  showTool(currTool);
  showColors();
  const prevCanvas = localStorage.getItem('prev-canvas');
  const img = new Image();
  img.src = prevCanvas;
  img.onload = () => {
    context.drawImage(img, 0, 0);
  };
}

function grayScale() {
  const imageData = context.getImageData(0, 0, 512, 512);
  const dataSrc = imageData.data;
  for (let i = 0; i < dataSrc.length; i += 4) {
    // eslint-disable-next-line operator-linebreak
    const luma =
      dataSrc[i] * 0.2116 + dataSrc[i + 1] * 0.7152 + dataSrc[i + 2] * 0.0722;
    dataSrc[i] = luma;
    dataSrc[i + 1] = luma;
    dataSrc[i + 2] = luma;
  }
  context.putImageData(imageData, 0, 0);
}
async function getImageLink(data) {
  try {
    const url = `https://api.unsplash.com/photos/random?query=town,${data}&client_id=8f315502f9333160e60fe214ca40e5e86de760084a061dea3f74ebfb92c79b77`;
    const response = await fetch(url);
    const link = await response.json();
    return link;
  } catch (err) {
    throw new Error(err);
  }
}
async function imageToCanvas(data) {
  const image = new Image();
  const link = await getImageLink(data);
  image.src = link.urls.small;
  image.crossOrigin = '';

  image.onload = () => {
    let max;
    imgWidth = image.width;
    imgHeight = image.height;

    if (imgWidth < imgHeight) {
      max = imgHeight;
    } else {
      max = imgWidth;
    }
    const ratioX = canvas.width / max;
    if (imgWidth > imgHeight) {
      context.drawImage(
        image,
        0,
        (canvas.height - imgHeight * ratioX) / 2,
        imgWidth * ratioX,
        imgHeight * ratioX,
      );
    } else {
      context.drawImage(
        image,
        (canvas.width - imgWidth * ratioX) / 2,
        0,
        imgWidth * ratioX,
        imgHeight * ratioX,
      );
    }
  };
}

canvas.addEventListener('mouseover', () => {
  if (pencil) {
    canvas.style.cursor = "url('./img/pencil.svg'), auto";
  }
  if (bucket) {
    canvas.style.cursor = "url('./img/paint-bucket.svg'), auto";
  }
  if (colorPicker) {
    canvas.style.cursor = "url('./img/choose-color.svg'), auto";
  }
});
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('currSize') === null) {
    sizex4 = true;
  }
  if (localStorage.getItem('currTool') === null) {
    pencil = true;
  }
  if (localStorage.getItem('currColorOld') === null) {
    context.fillStyle = '#ff0000';
  }
});
document.querySelector('.grayscale-btn').addEventListener('click', () => {
  if (count !== 0) {
    grayScale();
  } else {
    // eslint-disable-next-line no-alert
    alert('Error: image not loaded. Please, load the image first!');
  }
});
document.querySelector('.load-image-btn').addEventListener('click', () => {
  context.clearRect(0, 0, 512, 512);
  count += 1;
  const inputVal = document.querySelector('#input-field').value;
  imageToCanvas(inputVal);
});

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  if (sizex4) {
    const firstX = Math.floor(e.offsetX / 4);
    const firstY = Math.floor(e.offsetY / 4);
    previousCords = [firstX, firstY];
    if (pencil) {
      draw(e, 4);
    } else if (bucket) {
      fillCanvas();
    }
    if (colorPicker) {
      pickColor(e, 4);
    }
  }
  if (sizex2) {
    const firstX = Math.floor(e.offsetX / 2);
    const firstY = Math.floor(e.offsetY / 2);
    previousCords = [firstX, firstY];
    if (pencil) {
      draw(e, 2);
    } else if (bucket) {
      fillCanvas();
    }
    if (colorPicker) {
      pickColor(e, 2);
    }
  }
  if (sizex1) {
    const firstX = Math.floor(e.offsetX / 1);
    const firstY = Math.floor(e.offsetY / 1);
    previousCords = [firstX, firstY];
    if (pencil) {
      draw(e, 1);
    } else if (bucket) {
      fillCanvas();
    }
    if (colorPicker) {
      pickColor(e, 1);
    }
  }
});
window.addEventListener('beforeunload', () => {
  saveImage();
  saveSize();
  saveTool();
  saveColors();
});
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});
canvas.addEventListener('mousemove', (e) => {
  if (sizex4) {
    const lastX = Math.floor(e.offsetX / 4);
    const lastY = Math.floor(e.offsetY / 4);

    if (!isDrawing) return;
    if (pencil) {
      drawLine(previousCords[0], lastX, previousCords[1], lastY, 1);
    }
    previousCords = [lastX, lastY];
  }
  if (sizex2) {
    const lastX = Math.floor(e.offsetX / 2);
    const lastY = Math.floor(e.offsetY / 2);

    if (!isDrawing) return;
    if (pencil) {
      drawLine(previousCords[0], lastX, previousCords[1], lastY, 1);
    }
    previousCords = [lastX, lastY];
  }
  if (sizex1) {
    const lastX = Math.floor(e.offsetX / 1);
    const lastY = Math.floor(e.offsetY / 1);

    if (!isDrawing) return;
    if (pencil) {
      drawLine(previousCords[0], lastX, previousCords[1], lastY, 1);
    }
    previousCords = [lastX, lastY];
  }
});
canvas.addEventListener('mouseout', () => {
  isDrawing = false;
});
// eslint-disable-next-line no-undef
netlifyIdentity.on('login', () => {
  const outputText = document.querySelector('.login-text');
  // eslint-disable-next-line no-undef
  const userName = netlifyIdentity.currentUser().user_metadata.full_name;
  outputText.style.display = 'block';
  outputText.innerText = ` Welcome, ${userName}!`;
});
// eslint-disable-next-line no-undef
netlifyIdentity.on('logout', () => {
  const outputText = document.querySelector('.login-text');
  outputText.style.display = 'none';
});
document.querySelector('#small-canvas').addEventListener('click', () => {
  sizex4 = true;
  sizex2 = false;
  sizex1 = false;

  localStorage.setItem('canvasW', 128);
  localStorage.setItem('canvasH', 128);
  const sizeBtn = document.querySelectorAll('.size-btn');
  [].forEach.call(sizeBtn, (el) => {
    el.classList.remove('active');
  });
  document.querySelector('#small-canvas').classList.add('active');
  reSize(128, 128);
});
document.querySelector('#medium-canvas').addEventListener('click', () => {
  sizex4 = false;
  sizex2 = true;
  sizex1 = false;

  localStorage.setItem('canvasW', 256);
  localStorage.setItem('canvasH', 256);

  const sizeBtn = document.querySelectorAll('.size-btn');
  [].forEach.call(sizeBtn, (el) => {
    el.classList.remove('active');
  });
  document.querySelector('#medium-canvas').classList.add('active');

  reSize(256, 256);
});

document.querySelector('#large-canvas').addEventListener('click', () => {
  sizex4 = false;
  sizex2 = false;
  sizex1 = true;
  localStorage.setItem('canvasW', 512);
  localStorage.setItem('canvasH', 512);
  const sizeBtn = document.querySelectorAll('.size-btn');
  [].forEach.call(sizeBtn, (el) => {
    el.classList.remove('active');
  });
  document.querySelector('#large-canvas').classList.add('active');

  reSize(512, 512);
});
document.querySelector('.bucketBtn').addEventListener('click', () => {
  pencil = false;
  bucket = true;
  colorPicker = false;
  if (!pencil) {
    const listItems = document.querySelectorAll('.list-item');
    [].forEach.call(listItems, (el) => {
      el.classList.remove('active');
    });
    document.querySelector('.list-item.bucketBtn').classList.add('active');
  }
});
document.querySelector('.pencil-btn').addEventListener('click', () => {
  pencil = true;
  bucket = false;
  colorPicker = false;
  if (pencil) {
    const listItems = document.querySelectorAll('.list-item');
    [].forEach.call(listItems, (el) => {
      el.classList.remove('active');
    });
    document.querySelector('.list-item.pencil').classList.add('active');
  }
});

document.addEventListener('keydown', (event) => {
  const listItems = document.querySelectorAll('.list-item');
  if (event.target.nodeName.toLowerCase() !== 'input') {
    switch (event.code) {
      case 'KeyP':
        pencil = true;
        bucket = false;
        colorPicker = false;
        [].forEach.call(listItems, (el) => {
          el.classList.remove('active');
        });
        document.querySelector('.list-item.pencil').classList.add('active');
        break;
      case 'KeyB':
        pencil = false;
        bucket = true;
        colorPicker = false;

        [].forEach.call(listItems, (el) => {
          el.classList.remove('active');
        });
        document.querySelector('.list-item.bucketBtn').classList.add('active');
        break;
      case 'KeyC':
        pencil = false;
        bucket = false;
        colorPicker = true;

        [].forEach.call(listItems, (el) => {
          el.classList.remove('active');
        });
        document
          .querySelector('.list-item.chooseColorBtn')
          .classList.add('active');
        break;
      default:
    }
  }
});
document
  .querySelector('.list-item.currentColor')
  .addEventListener('click', () => {
    currentColor = document.querySelector('.curr-color').style.background;
    context.fillStyle = currentColor;
  });

document.querySelector('.blue-btn').addEventListener('click', () => {
  context.fillStyle = '#0000ff';
  document.querySelector(
    '.prev-color-btn',
  ).style.background = document.querySelector('.curr-color').style.background;
  document.querySelector('.curr-color').style.background = '#0000ff';
  const buttons = document.querySelectorAll('.button');
  [].forEach.call(buttons, (el) => {
    el.classList.remove('active');
  });
  document.querySelector('.blue-btn').classList.add('active');
});

document.querySelector('.prevColor').addEventListener('click', () => {
  const buttons = document.querySelectorAll('.button');
  context.fillStyle = document.querySelector(
    '.prev-color-btn',
  ).style.background;
  const prevColor = document.querySelector('.prev-color-btn').style.background;
  document.querySelector('.curr-color').style.background = prevColor;
  [].forEach.call(buttons, (el) => {
    el.classList.remove('active');
  });
  document.querySelector('.prev-btn').classList.add('active');
});

document.querySelector('.red-btn').addEventListener('click', () => {
  document.querySelector(
    '.prev-color-btn',
  ).style.background = document.querySelector('.curr-color').style.background;
  context.fillStyle = '#ff0000';
  document.querySelector('.curr-color').style.background = '#ff0000';
  const buttons = document.querySelectorAll('.button');
  [].forEach.call(buttons, (el) => {
    el.classList.remove('active');
  });
  document.querySelector('.red-btn').classList.add('active');
});

document.querySelector('.choose-color-btn').addEventListener('click', () => {
  pencil = false;
  bucket = false;
  colorPicker = true;
  const listItems = document.querySelectorAll('.list-item');
  [].forEach.call(listItems, (el) => {
    el.classList.remove('active');
  });
  document.querySelector('.chooseColorBtn').classList.add('active');
  document.querySelector('.blue-btn').classList.remove('active');
  document.querySelector('.red-btn').classList.remove('active');
});
document.querySelector('.currentColor').addEventListener('click', () => {
  document.querySelector('#current-color-picker').click();
});
document
  .querySelector('#current-color-picker')
  .addEventListener('input', (e) => {
    currentColor = e.target.value;
    const prevColor = document.querySelector('.curr-color').style.background;
    document.querySelector('.prev-color-btn').style.background = prevColor;
    context.fillStyle = currentColor;
    document.querySelector('.curr-color').style.background = currentColor;
  });

loadCanvas();
