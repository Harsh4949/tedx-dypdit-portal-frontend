// OCRReader.jsx
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCRReader = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleScan = () => {
    setLoading(true);
    Tesseract.recognize(
      image,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setText('Error occurred while scanning.');
      setLoading(false);
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto ">
      <h2 className="text-xl font-semibold mb-4">OCR Text Extractor</h2>

    <form className="max-w-lg mx-auto">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="user_avatar">Upload file</label>
      <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" accept="image/*" onChange={handleImageChange} />
    </form>
      
      {image && (
        <div className="mt-4">
          <img src={image} alt="Selected" className="max-w-full h-auto rounded" />
          <button
            onClick={handleScan}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Scanning...' : 'Extract Text'}
          </button>
        </div>
      )}
      {text && (
        <div className="mt-10 ">
          <h3 className="text-lg font-bold">Extracted Text:</h3>
          <p className="whitespace-pre-wrap bg-black p-3 rounded mt-2 ">
           <textarea
                className="h-40 w-full resize-none overflow-y-scroll border p-2"
                placeholder="Type something..."
                class="w-full h-40 p-2 border rounded text-amber-50"
                value={text}
                >
            </textarea>
            </p>
        </div>
      )}
    </div>
  );
};

export default OCRReader;
