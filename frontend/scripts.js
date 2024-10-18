document.addEventListener('DOMContentLoaded', function () {
  fetchExamples();
});

function fetchExamples() {
  // 更新 URL 以匹配服务器端点
  fetch('http://47.98.123.245:3000/test_code')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(files => {
      // 假设服务器返回的是文件名数组
      const exampleCardsContainer = document.getElementById('exampleCards');
      files.forEach(filename => {
        // 对于每个文件名，获取文件内容
        fetch(`http://47.98.123.245:3000/test_code/${filename}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.text();
          })
          .then(content => {
            // 创建卡片并添加到页面
            const card = document.createElement('div');
            card.className = 'card';

            const name = document.createElement('h4');
            name.textContent = filename;
            card.appendChild(name);

            const codePre = document.createElement('pre');
            codePre.textContent = content;
            card.appendChild(codePre);

            const loadButton = document.createElement('button');
            loadButton.textContent = '加载此代码';
            loadButton.onclick = function () {
              document.getElementById('textInput').value = content;
            };
            card.appendChild(loadButton);

            exampleCardsContainer.appendChild(card);
          })
          .catch(error => {
            console.error('Error fetching file content:', error);
          });
      });
    })
    .catch(error => {
      console.error('Error fetching examples:', error);
    });
}

function uploadText() {
  const text = document.getElementById('textInput').value;
  const blob = new Blob([text], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, 'test.txt');

  fetch('http://47.98.123.245:3000/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok.');
      return response.text();
    })
    .then(data => {
      document.getElementById('fileContent').textContent = data;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('fileContent').textContent = '上传失败，请重试。';
    });
}
