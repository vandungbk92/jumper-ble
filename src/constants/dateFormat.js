export function dateFormatter(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${('0' + dateFormat.getDate()).slice(-2)}/${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${dateFormat.getFullYear()}`;
  } else {
    return '';
  }
}

function formatDateDMY(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${('0' + dateFormat.getDate()).slice(-2)}/${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${dateFormat.getFullYear()}`;
  } else {
    return '';
  }
}

function formatDateYMD(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${dateFormat.getFullYear()}/${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${('0' + dateFormat.getDate()).slice(-2)}`;
  } else {
    return '';
  }
}

function formatDateMDY(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${('0' + dateFormat.getDate()).slice(-2)}/${dateFormat.getFullYear()}`;
  } else {
    return '';
  }
}

export function dateFormatYMD(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${dateFormat.getFullYear()}-${('0' + (dateFormat.getMonth() + 1)).slice(-2)}-${('0' + dateFormat.getDate()).slice(-2)}`;
  } else {
    return '';
  }
}

export function timeFormatter(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${('0' + dateFormat.getDate()).slice(-2)}/${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${dateFormat.getFullYear()} - ${('0' + dateFormat.getHours()).slice(-2)}:${('0' + (dateFormat.getMinutes())).slice(-2)}`;
  } else {
    return '';
  }
}
