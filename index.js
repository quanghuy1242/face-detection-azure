(function(){
  function parseUrlParams(urlParams) {
    return Object.entries(urlParams).map(pair => pair.join('=')).join('&');
  }

  function removeOldBox() {
    document.querySelectorAll('.face-item').forEach(box => {
      box.parentElement.removeChild(box);
    });
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
    const image = document.querySelector('#image');
    image.src = input;
    
    removeOldBox();
  
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
        res.forEach((face, index) => {
          const { top, left, height, width } = face.faceRectangle;
          const { age, emotion: { anger, happiness, sadness, neutral } } = face.faceAttributes;
  
          // Vẽ ảnh
          const square = document.createElement('qh-tooltip');
          square.classList.add('face-item');

          // Tính toán kích cỡ
          square.style.top = `${((top / image.naturalHeight) * 100)}%`;
          square.style.left = `${((left / image.naturalWidth) * 100)}%`;
          square.style.width = `${((width / image.naturalWidth) * 100)}%`;
          square.style.height = `${((height / image.naturalHeight) * 100)}%`;
          
          const inside = document.createElement('div');
          inside.classList.add('content-inside');
          square.appendChild(inside);

          //
          square.setAttribute('content', `
            <li>Age: ${age}</li>
            <li>Anger: ${anger}</li>
            <li>Happiness: ${happiness}</li>
            <li>Sadness: ${sadness}</li>
            <li>Neutral: ${neutral}</li>
          `);

          // Thêm box vào div lớn
          document.querySelector('.image-wrapper').appendChild(square);
        })
      })
  }
  
  document.querySelector('#btn-detect').addEventListener('click', processImage, false);
})();