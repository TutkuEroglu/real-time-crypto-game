function customAlert(tag,message,color) {
    const modalDiv = document.createElement("div");
    modalDiv.className = `alert-modal`;
    modalDiv.innerHTML = `
        <div class="alert-content ${color}">
            <h1>${tag}</h1>
            <p>${message}</p>
            <button class="alert-button" onclick="closeAlert()">Got it</button>
        </div>
    `;

    document.body.appendChild(modalDiv);
}

function closeAlert() {
    const modalDiv = document.querySelector(".alert-modal");
    modalDiv.remove();
}