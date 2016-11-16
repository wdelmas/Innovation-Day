console.log('Hello from extension-do')

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

  //sendResponse({farewell: "goodbye"});

  alertify.parent(document.body) // https://github.com/alertifyjs/alertify.js/issues/101
  alertify
    .delay(0)
    .maxLogItems(100)
    .logPosition("bottom right")

  const tour = new Shepherd.Tour({
    defaults: {
      classes: 'shepherd-theme-arrows',
      scrollTo: false,
      advanceOn: 'body click',
    }
  })


tour.addStep({
  title: 'Welcome to dashlane form analyser',
  text: '...',
})

////////////////////////////////////

  console.groupCollapsed('Analysis')
  //alertify.log("Starting analysis...")

  const pmfMeta = (function getPmfMeta() {
    const metas = document.getElementsByTagName('meta');

    for (let i=0; i<metas.length; i++) {
      if (metas[i].getAttribute("name") == "password-manager-friendly") {
        return metas[i]
      }
    }
  })()
  console.log('PMF meta', pmfMeta)
  if (pmfMeta && Boolean(pmfMeta.getAttribute("value"))) {
    //alertify.success("This site reports itself as password-manager-friendly !")
  }

  const analysisResult = getVirtualDom()
  console.log('result', analysisResult)

  //alertify.log("Analysis done.")
  console.groupEnd()

////////////////////////////////////

  console.group('Action')
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
      advanceOn: 'body click',
    })

    result.children.forEach((child, iid) => {
      console.group('Input #' + iid)
      console.log(child)

      const inputSelector = `#${formElement.id} ` + child.selector()
      console.log("selector:", inputSelector)
      const input = $(inputSelector)[0]
      console.log(input)

      let text = `I detected an input`

      const type = input.type
      if(!type)
        text += `<br/><b>This field has no type !</b>`

      switch(child.attr) {
        case 'email':
          text += `<br/>This field is annotated as "${child.attr}"</b>`
          if (type != 'email')
            text += `<br/><span style="color: red;">This field should have type "email" !</span>`
          break;

        case 'password':
          text += `<br/>This field is annotated as "${child.attr}"</b>`
          if (type != 'password')
            text += `<br/><span style="color: red;">This field should have type "password" !</span>`
          else
            text += `<br/><span style="color: green;">This field has correct type "password".</span>`
          break;

        case 'firstname':
          text += `<br/><span style="color: red;">I don't have enough info to recognize this field, and can't autofill it !<br />You should annotate it !</span>`
          break;

        case 'lastname':
          text += `<br/>This field is annotated as "${child.attr}"</b>`
          break;

        case 'candidate-password':
          text += `<br/>I <b>recognize it</b> and can <b>generate</b> a value for it !"</b>`
          break;

        case 'candidate-password-repeated':
          text += `<br/>I <b>recognize it</b> and <b>know a value</b> for it !"</b>`
          break;

        default:
          text += `<br/>I don't recognize that, sorry :-(</b>`
          break
      }

      if (groupCount[result.selector()] > 1) {
        text += `<br/>But <b>NOT</b> autofilling since this is a repeated group !</b>`
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
        advanceOn: 'body click',
      })

      console.groupEnd()
    })

    console.groupEnd()
  })

  tour.addStep({
    title: 'All done',
    text: 'Thank you for watching !',
    advanceOn: 'body click'
  });

  tour.start()
  console.groupEnd()
});
