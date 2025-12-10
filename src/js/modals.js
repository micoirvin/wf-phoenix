export const modals = () => {
  const modalButtons = document.querySelectorAll('[button-function="modal-open"]');
  modalButtons.forEach((button) => {
    button.setAttribute('href', '');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      let name = button.getAttribute('modal-name');
      if (!name) name = button.getAttribute('button-function-arg1');

      const modal = document.querySelector(`[modal][modal-name=${name}]`);
      modal?.setAttribute('is-open', '');
    });
  });

  const modalCloseButtons = document.querySelectorAll('[modal-close]');
  modalCloseButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      button.closest('[modal]')?.removeAttribute('is-open');
    });
  });
};
