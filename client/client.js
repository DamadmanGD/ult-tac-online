
const nick = window.prompt("name")

const log = (text) => {
    const l = document.querySelector("#chat-list")
    const lt = document.createElement("li")
    lt.innerHTML = text
    l.appendChild(lt)
    l.scrollTop = l.scrollHeight
    
}

const onChatSubmitted = (sock) => (e) => {   
    e.preventDefault();
    const input = document.getElementById("chat");
    const text = input.value;
    input.value = " ";
    
    sock.emit("msgTS", nick + ": " + text)
   
}

const sock = io();

const joinroom = () => {
    for (invalidRoom=false;invalidRoom==false;) {
        
        const roomnum = window.prompt("enter a number 1-10")
        const roomid = parseInt(roomnum)
        if (roomid<=10 && roomid>=1) {
            invalidRoom = true
            //alert("joined room " + roomid)
            sock.emit("join", nick, roomnum)
        }
        else {
            alert("This number is not between 1 and 10")
        }
    }  
}
const startbtn = () => {
    document.getElementById("changer").innerHTML =
    '<button id="start">Ready</button>';
    document.getElementById("start").addEventListener("click", startGame)
}
const startGame=() => {
    ready = true
    startCount ++
    sock.emit("gameStart", startCount)
    document.getElementById("start").remove() 
}

const drawBoard = (boardHTML) => {
    document.getElementById("changer").innerHTML = boardHTML
    
}
const onClick = (t, r, c) => {
    if (p==pA) {
        const doc = document.getElementById(t).rows[r].cells[c]
        if (doc.innerHTML == ("_") && 
        ((t == (3 * rAvailable) + cAvailable ) || moveAnywhere==true))
        {
            
            sock.emit("move", t,r,c,p)
            document.getElementById("header").innerHTML="Ultimate Tic Tac Toe"
            document.getElementById("header").style.color="black"
        }   
        else {
            document.getElementById("header").innerHTML="This move is not legal"
            document.getElementById("header").style.color="red"
        }
        /*if (catTest(b)) {
            rAvailable = 10
            cAvailable= 10
            moveAnywhere = true
            catBoard(b)
        }
        else if (boardCheck(doc.innerHTML, b)) {
                
            rAvailable = 10
            cAvailable= 10
            moveAnywhere = true
            boardDone(doc.innerHTML, b)

        }
        else if (document.getElementById("side").rows[r].cells[c].innerHTML != "_") {
            rAvailable = 10
            cAvailable= 10
            moveAnywhere = true
        }
        else {
            rAvailable = r 
            cAvailable= c
            bAvailableStr = ((3 * rAvailable) + cAvailable).toString()

            document.getElementById(bAvailableStr).style.backgroundColor="green"
            moveAnywhere = false
        }*/
    }
    else {
        document.getElementById("header").innerHTML="It's not your turn"
            document.getElementById("header").style.color="red"
    }
}
const addClicks = () => {
    for(boardStack=0;boardStack<9;boardStack++) {
        let bSString = boardStack.toString();
        rowStack = 0
        for(rowStack=0;rowStack<3;rowStack++) {
            let rowTemp = rowStack;
            cellStack = 0
            for(cellStack=0;cellStack<3;cellStack++) {
                let cellTemp = cellStack;
                document.getElementById(bSString).rows[rowTemp].cells[cellTemp].addEventListener("click", function() {
                    if (gameGoing==true) {
                        onClick(bSString, rowTemp, cellTemp)
                    }  
                })
            }
        }
    }
}
const gameInit = (boardHTML) => {
    fOccupied=0
    gameGoing=true
    pA="X"
    moveAnywhere = true
    rAvailable = 10
    cAvailable = 10
    bAvailableStr = "0"
    drawBoard(boardHTML)
    addClicks()
}
const bUpd = (t,r,c,ps) => {
    document.getElementById(bAvailableStr).style.backgroundColor="white"
    const doc = document.getElementById(t).rows[r].cells[c]
    doc.innerHTML=ps
    if (boardCheck(ps,t)) {
        boardDone(ps, t)
    }
}
function boardDone(pp, b) {
    document.getElementById(b).rows[0].cells[0].innerHTML = pp;
    document.getElementById(b).rows[1].cells[0].innerHTML = pp;
    document.getElementById(b).rows[2].cells[0].innerHTML = pp;
    document.getElementById(b).rows[0].cells[1].innerHTML = pp;
    document.getElementById(b).rows[1].cells[1].innerHTML = pp;
    document.getElementById(b).rows[2].cells[1].innerHTML = pp;
    document.getElementById(b).rows[0].cells[2].innerHTML = pp;
    document.getElementById(b).rows[1].cells[2].innerHTML = pp;
    document.getElementById(b).rows[2].cells[2].innerHTML = pp;
    document.getElementById(b).style.backgroundColor="pink"
    fCheck(b, pp)

}
function boardCheck(pp, t) {
    const d = document.getElementById(t)
    if (
    lineTest(d.rows[0].cells[0], d.rows[0].cells[1], d.rows[0].cells[2],pp) ||
    lineTest(d.rows[1].cells[0], d.rows[1].cells[1], d.rows[1].cells[2],pp) ||
    lineTest(d.rows[2].cells[0], d.rows[2].cells[1], d.rows[2].cells[2],pp) ||
    //verts
    lineTest(d.rows[0].cells[0], d.rows[1].cells[0], d.rows[2].cells[0],pp) ||
    lineTest(d.rows[0].cells[1], d.rows[1].cells[1], d.rows[2].cells[1],pp) ||
    lineTest(d.rows[0].cells[2], d.rows[1].cells[2], d.rows[2].cells[2],pp) ||
    //dags
    lineTest(d.rows[0].cells[0], d.rows[1].cells[1], d.rows[2].cells[2],pp) ||
    lineTest(d.rows[0].cells[2], d.rows[1].cells[1], d.rows[2].cells[0],pp)
    ) 
    {
        
        return(true)
    }
}
function lineTest(a,b,c, pp) {
    if (a.innerHTML == pp && 
    b.innerHTML == pp && 
    c.innerHTML == pp) {
        return(true);
    }
    else {
        return(false);
    }
}
function fCheck(b, pl) {
    const bStr = b.toString();
    const c = b % 3;
    const r = (b - (b % 3)) / 3 ;
    document.getElementById("side").rows[r].cells[c].innerHTML = pl;
    var d = document.getElementById("side")
    
    if (
        fLineTest(d.rows[0].cells[0], d.rows[0].cells[1], d.rows[0].cells[2],pl) ||
        fLineTest(d.rows[1].cells[0], d.rows[1].cells[1], d.rows[1].cells[2],pl) ||
        fLineTest(d.rows[2].cells[0], d.rows[2].cells[1], d.rows[2].cells[2],pl) ||
        //verts
        fLineTest(d.rows[0].cells[0], d.rows[1].cells[0], d.rows[2].cells[0],pl) ||
        fLineTest(d.rows[0].cells[1], d.rows[1].cells[1], d.rows[2].cells[1],pl) ||
        fLineTest(d.rows[0].cells[2], d.rows[1].cells[2], d.rows[2].cells[2],pl) ||
        //dags
        fLineTest(d.rows[0].cells[0], d.rows[1].cells[1], d.rows[2].cells[2],pl) ||
        fLineTest(d.rows[0].cells[2], d.rows[1].cells[1], d.rows[2].cells[0],pl)
        ) 
        {
            gEnd(pl)
            //alert(pl + " wins! click ok to play again")
            //window.location.reload();
        }
    else {
        fOccupied = fOccupied + 1
    }

    if (fOccupied==9) {
        sock.emit("gEnd", "cat")
    }
}
function fLineTest(a,b,c, pp) {
    if (a.innerHTML == pp && 
    b.innerHTML == pp && 
    c.innerHTML == pp &&
    p != "^") {
        return true
    }
    
}
function gEnd(pw) {
    if (pw=="cat") {
        alert("Cat's game!")
    }
    else if (pw == p) {
        alert("You win!")
    }
    else {
        alert("You lose!")
    }
    gameGoing = false
    sock.emit("endSlct")
    /*document.getElementById("changer").innerHTML += 
    '<button id="moveOn">Ok</button>';
    document.getElementById("moveOn").addEventListener("click",function () {

    })*/
    
}
function endSlctSc(rN) {
    document.getElementById("changer").innerHTML += 
    '<button id="endStay">Stay in room</button><button id="endNew">Join new room</button>';
    document.getElementById("endStay").addEventListener("click",function () {
        sock.emit("join", nick, rN)
    })
    document.getElementById("endNew").addEventListener("click",function () {
        joinroom()
    })
}
function catTest(b) {
    if (document.getElementById(b).rows[0].cells[0].innerHTML != "_" &&
    document.getElementById(b).rows[1].cells[0].innerHTML != "_" &&
    document.getElementById(b).rows[2].cells[0].innerHTML != "_" &&
    document.getElementById(b).rows[0].cells[1].innerHTML != "_" &&
    document.getElementById(b).rows[1].cells[1].innerHTML != "_" &&
    document.getElementById(b).rows[2].cells[1].innerHTML != "_" &&
    document.getElementById(b).rows[0].cells[2].innerHTML != "_" &&
    document.getElementById(b).rows[1].cells[2].innerHTML != "_" &&
    document.getElementById(b).rows[2].cells[2].innerHTML != "_"
    ) {
        return true
    }
}
function moveAllChecks(b,r,c) {
    const doc = document.getElementById(b).rows[r].cells[c]
    if (catTest(b)) {
        rAvailable = 10
        cAvailable= 10
        moveAnywhere = true
        catBoard(b)
        alert("cat")
    }
    else if (boardCheck(doc.innerHTML, b)) {
            
        rAvailable = 10
        cAvailable= 10
        moveAnywhere = true
        boardDone(doc.innerHTML, b)
        alert("")

    }
    else if (document.getElementById("side").rows[r].cells[c].innerHTML != "_") {
        rAvailable = 10
        cAvailable= 10
        moveAnywhere = true
    }
    else {
        rAvailable = r 
        cAvailable= c
        bAvailableStr = ((3 * rAvailable) + cAvailable).toString()

        document.getElementById(bAvailableStr).style.backgroundColor="green"
        moveAnywhere = false
    }
}
function catBoard(b) {
    document.getElementById(b).rows[0].cells[0].innerHTML = "^";
    document.getElementById(b).rows[1].cells[0].innerHTML = "u";
    document.getElementById(b).rows[2].cells[0].innerHTML = " ";
    document.getElementById(b).rows[0].cells[1].innerHTML = " ";
    document.getElementById(b).rows[1].cells[1].innerHTML = " ";
    document.getElementById(b).rows[2].cells[1].innerHTML = "w";
    document.getElementById(b).rows[0].cells[2].innerHTML = "^";
    document.getElementById(b).rows[1].cells[2].innerHTML = "u";
    document.getElementById(b).rows[2].cells[2].innerHTML = " ";
    document.getElementById(b).style.backgroundColor="pink"
    fCheck(b)
}
sock.on("msgTC", (text) => log(text));
sock.on("pjoined", (player, room) => log(player + " has joined the room " + room));
sock.on("roomFull", () => alert("This room is full!"));
sock.on("inRoom", function (room) {
    //alert("hi")
    document.getElementById("roomSig").innerHTML="Room: " + room;
    document.getElementById("changer").innerHTML="";
    startCount = 0
    document.getElementById("startSig").innerHTML = "";
    ready=false
    document.getElementById("start").remove()
    //const startCount=0
    
});
sock.on("roomOccUpd", function (occ) {
    document.getElementById("occ").innerHTML=occ+"/2"
})
sock.on("room2occ", startbtn)
sock.on("STCstart", function (boardHTML) {
    gameInit(boardHTML)
})
sock.on("pAssign", function (xo) {
    p = xo
    alert("You are player "+xo)
    document.getElementById("pXO").innerHTML = "You are player "+xo;
})
sock.on("moveTC", function (t,r,c,ps) {
    bUpd(t,r,c,ps)
    if (ps=="O") {
        pA = "X"
    }
    else {
        pA="O"
    }
    document.getElementById("turnShow").innerHTML =pA
    document.getElementById("header").innerHTML="Ultimate Tic Tac Toe"
    document.getElementById("header").style.color="black";
    moveAllChecks(t,r,c)
})
sock.on("endSlctTC", function (rN) {
    endSlctSc(rN)
})
sock.on("pStartUpd", function (num) {
    document.getElementById("startSig").innerHTML = "Ready: " +num+"/2";
    if (ready) {
        document.getElementById("startSig").style.color="green"
    }
    startCount=num
    //alert(startCount)
})
sock.on("disconnect", function () {
    sock.emit("disc")
})
document.querySelector("#chat-form").addEventListener("submit", onChatSubmitted(sock));
document.getElementById("join room").addEventListener("click", joinroom)
