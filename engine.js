console.log('hello from engine.js')

function getNodes(){
    var elements = $('[pm]')

        var nodes = []

    elements.each( (value ) => {
        var current = $(elements[value])
        nodes.push({
            attr: current.attr('pm'),
            selector: function(){
                return'[pm='+this.attr+']'
            }
        })
    })
    return nodes.reverse()
}

function buildVirtualDom(nodes){
    var virtualDom = []
    var tmpNode = new domNode()
    for(var i = 0; i < nodes.length;i++){
        if(nodes[i].attr.indexOf('group')> 1){
            tmpNode.type = 'group'
            virtualDom.push(Object.assign(tmpNode,nodes[i]))
            tmpNode = new domNode()
        }else{
            tmpNode.children.unshift(nodes[i])
        }
    }
    return virtualDom.reverse()
}

function domNode() {
    this.children = []
}

function getVirtualDom(){
    var nodes = getNodes()
    var dom =  buildVirtualDom(nodes)
    return dom
}
