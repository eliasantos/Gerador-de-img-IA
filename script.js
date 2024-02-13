const apiKey = "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"

const maxImages = 4; 
let selectedImageNumber = null; 

function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//função para desabilitar o botão de gerar durante o processo
function disableGenerateButton(){
    document.getElementById("generate").disabled=true;
}

//função para habilitar o botão de gerar após o processo
function enableGenerateButton(){
    document.getElementById("generate").disabled=false;
}

//função para limpar a grade de imagens
function clearImageGrid(){
    // Correção: Corrigir o ID para 'imagegrid'
    const imageGrid = document.getElementById('imagegrid');
    imageGrid.innerHTML = "";
}

//função para gerar as imagens
async function generateImgs(){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById('loading');
    loading.style.display='block';

    const imageUrls = [];
    for(let i = 0; i < maxImages; i++){
        const randomNumber = getRandomNumber(1,10000);
        
        const input = document.getElementById("user-prompt").value;
        
        const prompt = `${input} ${randomNumber}`;
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
           {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                
                "Authorization": `Bearer ${apiKey}`,
            },
            
            body: JSON.stringify({ inputs: prompt}),
           }
        );

        if(!response.ok){
            alert("Falha ao gerar imagem! Tente novamente mais tarde.");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        
        document.getElementById("imagegrid").appendChild(img);
        
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null;
}

document.getElementById("generate").addEventListener('click', () => {
    
    generateImgs();
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    
    link.download = `image-${imageNumber+1}.jpg`;
    link.click();
}
