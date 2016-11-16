
alertify.parent(document.body) // https://github.com/alertifyjs/alertify.js/issues/101
alertify
  .delay(0)
  .maxLogItems(100)
  .logPosition("bottom right")

const tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-arrows',
    scrollTo: false,
  }
})

////////////////////////////////////

console.groupCollapsed('Analysis')
alertify.log("Starting analysis...")

const analysisResult = getVirtualDom()
console.log('result', analysisResult)

alertify.log("Analysis done.")
console.groupEnd()

////////////////////////////////////

console.group('Action')
const user = window._user_data[0]
const groupCount = {}

analysisResult.forEach((result , fid) => {
  "use strict";

  console.group('Result #' + fid)
  console.log(result)

  groupCount[result.selector()] = groupCount[result.selector()] | 0
  groupCount[result.selector()]++

  const formElement = $(result.selector())[groupCount[result.selector()] - 1]
  formElement.id = `form-${result.attr}-${fid}`

  tour.addStep({
    title: 'form #' + (fid + 1),
    text: 'I detected a form...',
    attachTo: `#${formElement.id} right`,
  })

  result.children.forEach((child, iid) => {
    console.group('Input #' + iid)
    console.log(child)

    const inputSelector = `#${formElement.id} ` + child.selector()
    console.log("selector:", inputSelector)
    const input = $(inputSelector)[0]
    let autofillValue = null

    let text = `I detected an input of type <b>"${child.attr}"</b>`

    switch(child.attr) {
      case 'candidate-password':
        text += `<br/>I <b>recognize it</b> and can <b>generate</b> a value for it !"</b>`
        autofillValue = '2OHjd^GQaL!u' // yes, cheating ;)
        break;

      case 'candidate-password-repeated':
        text += `<br/>I <b>recognize it</b> and <b>know a value</b> for it !"</b>`
        autofillValue = '2OHjd^GQaL!u' // yes, cheating ;)
        break;

      default:
        if (user[child.attr]) {
          text += `<br/>I <b>recognize it</b> and <b>know a value</b> for it !"</b>`
          autofillValue = user[child.attr]
        }
        else {
          text += `<br/>I don't recognize that, sorry :-(</b>`
        }
        break
    }


    if (autofillValue) {
      if (groupCount[result.selector()] > 1) {
        text += `<br/>But <b>NOT</b> autofilling since this is a repeated group !</b>`
        autofillValue = null
      }
      else
        text += `<br/>Autofilling with "<b>${autofillValue}</b>"...</b>`
    }

    const textElement = document.createElement("div")
    textElement.innerHTML = text

    const inputOffset = $(input).offset()
    const tourElement = document.createElement("div")
    tourElement.style.position = "absolute"
    tourElement.style.backgroundColor = "rgba(255, 0, 0, 0.01)"
    tourElement.style.left = `${inputOffset.left}px`
    tourElement.style.top = `${inputOffset.top}px`
    tourElement.style.width = `${$(input).outerWidth() - 3}px`
    tourElement.style.height = `${$(input).outerHeight() - 3}px`
    tourElement.id = `tour-step-${fid}-${iid}`

    window.document.body.appendChild(tourElement)

    tour.addStep({
      title: `form #${fid + 1} input #${iid + 1}`,
      text: textElement,
      attachTo: `#${tourElement.id} right`,
      //attachTo: inputSelector + ' right',
      when: {
        show: function() {
          if (autofillValue) input.value = autofillValue
        }
      }
    })

    console.groupEnd()
  })

  console.groupEnd()
})

tour.addStep({
  title: 'All done',
  text: 'Thank you for watching !',
});

tour.start()
console.groupEnd()
