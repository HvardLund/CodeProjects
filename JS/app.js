const loanButtonElement = document.getElementById("loanButton");
const workButtonElement = document.getElementById("workButton");
const bankButtonElement = document.getElementById("bankButton");
const repayLoanButtonElement = document.getElementById("repayLoanButton");
const balanceElement = document.getElementById("balance")
const payElement = document.getElementById("pay")
const laptopElement = document.getElementById("laptops")
const featuresElement = document.getElementById("features")
const imageElement= document.getElementById("laptopImage")
const nameElement = document.getElementById("laptopName")
const descriptionElement = document.getElementById("laptopDescription")
const priceElement = document.getElementById("laptopPrice")
const buyButtonElement = document.getElementById("buyButton")
const debtElement = document.getElementById('debt')
const debtTextContainerElement = document.getElementById('debtTextContainer')

let saldo = 0
let payAmount = 0
let debt = 0
let laptops = []
let currentLaptop = null

//Adds the various laptops as options in the dropdown menu
const addElementsToSelect = (list) => {

    for(item of list){
        const option = document.createElement('option')
        option.value = item.id
        option.appendChild(document.createTextNode(item.title))
        laptopElement.appendChild(option)
    }
}

//Handles the logic when a new laptop is selected, displaying its features
const selectNewLaptop = event => {
    featuresElement.innerHTML=''
    const selectedLaptop = laptops[event.target.selectedIndex]
    currentLaptop = selectedLaptop
    
    specs = selectedLaptop.specs
    for(spec of specs) {
        const feature = document.createElement('h5')
        feature.textContent = spec
        featuresElement.appendChild(feature)
    }

    imageElement.src = `https://hickory-quilled-actress.glitch.me/${selectedLaptop.image}`
    nameElement.textContent = selectedLaptop.title
    descriptionElement.textContent = selectedLaptop.description
    priceElement.textContent = selectedLaptop.price
}

//displaying the features of the first laptops
const setInitialLaptop = () => {
    const selectedLaptop = laptops[0]
    specs = selectedLaptop.specs
    currentLaptop = selectedLaptop
    for(spec of specs) {
        const feature = document.createElement('h5')
        feature.textContent = spec
        featuresElement.appendChild(feature)
    }

    imageElement.src = `https://hickory-quilled-actress.glitch.me/${selectedLaptop.image}`
    nameElement.textContent = selectedLaptop.title
    descriptionElement.textContent = selectedLaptop.description
    priceElement.textContent = selectedLaptop.price

}

//Method for fetching laptops
async function getLaptops() {
    try {
        const fetchedLaptops = await fetch(`https://hickory-quilled-actress.glitch.me/computers`).then(response => response.json())
        laptops = fetchedLaptops
        addElementsToSelect(laptops)
        setInitialLaptop()
    }

    catch(error) {
        console.error("Didn't find any laptops", error)
    }
}

//Taking the loan amount as input and adding it to the total bank balanceElement
const askForLoan = () => {
    if(debt == 0){
        let loanAmount = Number(window.prompt("Type a number", ""))
        
        if(loanAmount < 0){
            alert('Loan amount must be higher than 0kr')
        }

        else if (2*saldo >= loanAmount){
            saldo += loanAmount
            balanceElement.textContent = saldo
            debt += loanAmount
            debtElement.textContent = debt
            repayLoanButtonElement.style.display = 'block'
            debtTextContainerElement.style.display ='flex'
            
        }
        else {alert(`You can not loan more than twice your bank balance. \nYour loan can not exceed ${2*saldo}kr `)}
    }

    else(
        alert(`You already owe ${debt}kr.\n You have to repay it before you can get another loan`)
    )
}

//Working increases pay amount
const work = () => {
    payAmount+= 100
    payElement.textContent = payAmount
}

//Function used to handle loan payback calculation used in the moveToBank function
const calculatePayback = (factor) => {
    if(debt == 0){return 0}
    if(payAmount*0.1*factor >= debt){
        repayLoanButtonElement.style.display = 'none'
        debtTextContainerElement.style.display = 'none'
        return debt
    }
    else{
        return payAmount*0.1*factor
    }
}

//Moving salary to bank
const moveToBank = () => {
    let payBackAmount = calculatePayback(1)
    debt-=payBackAmount
    debtElement.textContent = debt

    saldo+=(payAmount-payBackAmount)
    balanceElement.textContent = saldo
    payAmount = 0
    payElement.textContent = payAmount
}

//Function used to pay back loan
const payLoan = () => {
    let payBackAmount = calculatePayback(10)
    debt-=payBackAmount
    debtElement.textContent = debt
    saldo+=(payAmount-payBackAmount)
    balanceElement.textContent = saldo
    payAmount = 0
    payElement.textContent = payAmount
}

const buyLaptop = () => {
    if(saldo>=currentLaptop.price){
        saldo-= currentLaptop.price
        balanceElement.textContent = saldo
        alert(`Congratulations! You are now the lucky owner of ${currentLaptop.title}.\nWe do not provide any services post purchase, meaning that if you run into any problems, you're on your own :D`)
    }
    else{
        alert(`You can't aford this laptop, try working harder or get a loan`)
    }
}

getLaptops()

//EventListeners
loanButtonElement.addEventListener('click', askForLoan)
buyButtonElement.addEventListener('click', buyLaptop)
workButtonElement.addEventListener('click', work)
bankButtonElement.addEventListener('click', moveToBank)
laptopElement.addEventListener('change', selectNewLaptop)
repayLoanButtonElement.addEventListener('click', payLoan)