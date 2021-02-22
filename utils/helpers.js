/* eslint-disable no-undef */
export const colorLog = (message, ...optionalParams) => {
  if (!optionalParams) {
    console.log(`%c ${message}`, 'background: #222; color: #bada55');
  } else {
    console.log(`%c ${message}`, 'background: #222; color: #bada55', ...optionalParams);
  }
};

export const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
