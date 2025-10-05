function setLoading(isLoading) {
	const btnSpan = document.getElementById("generate-btn");

	if (isLoading) {
		btnSpan.innerHTML = "Gerando Backgroud...";
	} else {
		btnSpan.innerHTML = "Gerar Background Mágico";
	}
}

document.addEventListener("DOMContentLoaded", function () {
	// 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.

	const form = document.querySelector(".form-group");
	const textArea = document.getElementById("description");
	const htmlCode = document.getElementById("html-code");
	const cssCode = document.getElementById("css-code");
	const preview = document.getElementById("preview-section");

	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		// 2. Obter o valor digitado pelo usuário no campo de texto.
		const description = textArea.value.trim();

		if (!description) {
			return;
		}

		// 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
		setLoading(true);

		// 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
		try {
			const response = await fetch("https://tfernandesweb.app.n8n.cloud/webhook-test/gerador-fundo", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ description }),
			});

			const data = await response.json();
			htmlCode.textContent = data.code || "";
			cssCode.textContent = data.style || "";

			preview.style.display = "block";
			preview.innerHTML = data.code || "";

			let styleTag = document.getElementById("dynamic-style");

			if (styleTag) styleTag.remove();

			if (data.style) {
				styleTag = document.createElement("style");
				styleTag.id = "dynamic-style";

				styleTag.textContent = data.style;
				document.head.appendChild(styleTag);
			}
		} catch (error) {
			console.error("Erro ao gerar o fundo:", error);
			htmlCode.textContent = "Não consegui gerar o código HTML, tente novamente";
			cssCode.textContent = "Não consegui gerar o código CSS, tente novamente";
			preview.innerHTML = "";
		} finally {
			setLoading(false);
		}
	});
});
