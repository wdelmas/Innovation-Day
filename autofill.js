
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

analysisResult.forEach((result , fid) => {
  "use strict";

  const user = window._user_data[0]

  console.group('Result #' + fid)
  console.log(result)

  tour.addStep({
    title: 'form #' + (fid + 1),
    text: 'I detected a form...',
    attachTo: result.selector() + ' right',
  })

  result.children.forEach((child, iid) => {
    console.group('Input #' + iid)
    console.log(child)

    const inputSelector = result.selector() + ' ' + child.selector()
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

    if (autofillValue)
      text += `<br/>Autofilling with "<b>${autofillValue}</b>"...</b>`

    const textElement = document.createElement("div")
    textElement.innerHTML = text

    const inputOffset = $(input).offset()
    const tourElement = document.createElement("div")
    tourElement.style.position = "absolute"
    tourElement.style.backgroundColor = "red"
    tourElement.style.opacity = 0.01
    tourElement.style.left = `${inputOffset.left}px`
    tourElement.style.top = `${inputOffset.top}px`
    tourElement.style.width = `${$(input).outerWidth()}px`
    tourElement.style.height = `${$(input).outerHeight()}px`
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
