function parseUrlParams(urlParams) {
  return Object.entries(urlParams).map(pair => pair.join('=')).join('&');
}

function processImage() {
  const params = {
    "returnFaceId": "true",
    "returnFaceLandmarks": "false",
    "returnFaceAttributes":
      "age,gender,headPose,smile,facialHair,glasses,emotion," +
      "hair,makeup,occlusion,accessories,blur,exposure,noise"
  };
  const input = document.querySelector('#image-input').value;

  if (!input) { return; }

  // Show image
  document.querySelector('#image').src = input;

  fetch(`${uriBase}?${parseUrlParams(params)}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    },
    credentials: 'same-origin',
    body: JSON.stringify({ url: input })
  }).then(res => res.json())
    .then(res => {
      const faceCount = res.length;
      
      // Reset
      document.querySelector('#information').innerHTML = `Có ${faceCount} người`;
      
      [...Array(faceCount).keys()].forEach(index => {
        const { top, left, height, width } = res[index].faceRectangle;
        const { age, emotion } = res[index].faceAttributes;

        // Vẽ ảnh
        const square = document.createElement('div');
        square.classList.add('face-item');
        square.style.top = `${top}px`;
        square.style.left = `${left}px`;
        square.style.width = `${width}px`;
        square.style.height = `${height}px`;
        document.querySelector('.image-wrapper').appendChild(square);

        // Thông tin
        const p = document.createElement('p');
        p.innerHTML = `
          <div>Guong Mat so ${index + 1}<div>
          <ul>
            <li>Age: ${age}</li>
            <li>Anger: ${emotion.anger}</li>
            <li>Happiness: ${emotion.happiness}</li>
            <li>Sadness: ${emotion.sadness}</li>
            <li>Neutral: ${emotion.neutral}</li>
          </ul>
        `;
        document.querySelector('#information').appendChild(p);
      })
    })
}

document.querySelector('#btn-detect').addEventListener('click', processImage, false);