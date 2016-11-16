
alertify.parent(document.body) // https://github.com/alertifyjs/alertify.js/issues/101
alertify
  .delay(0)
  .maxLogItems(100)
  .logPosition("bottom right")

const tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-arrows',
    scrollTo: true,
  }
})

////////////////////////////////////

console.group('Analysis')
alertify.log("Starting analysis...")

const analysisResult = getVirtualDom()
console.log('result', analysisResult)

alertify.success("Analysis done !")
console.groupEnd()

////////////////////////////////////

console.group('Action')

analysisResult.forEach((result , fid) => {
  "use strict";

  console.group('Result #' + fid)
  console.log(result)

  tour.addStep({
    title: 'Detected form #' + (fid + 1),
    text: 'I detected a form...',
    attachTo: result.selector() + ' right',
  })

  result.children.forEach((child, iid) => {
    tour.addStep({
      title: `form #${fid + 1} input #${iid + 1}`,
      text: 'I detected an input...',
      attachTo: child.selector() + ' right',
    })

  })

  tour.addStep({
    title: 'End of form #' + (fid + 1),
    text: '..',
    attachTo: result.selector() + ' right',
  })

  console.groupEnd()
})

tour.start()
console.groupEnd()
