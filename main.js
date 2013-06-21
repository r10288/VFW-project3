/*
 Ryan Cantone	
 6-17-2013
 Project 3
 VFW 1306
*/


window.addEventListener("DOMContentLoaded", function doItAll(){
    
    function $(e){
        var elementID = document.getElementById(e);
        return elementID;
    }

    function makeSelect(){
        var formTag = document.getElementsByTagName("form"),
            selectLi = $("select"),
            makeSelect = document.createElement("select");
            makeSelect.setAttribute("id", "heroes");
        for(var i = 0, j = heroClass.length; i < j; i++){
            var makeOption = document.createElement("option");
            var optText = heroClass[i];
            makeOption.setAttribute("value", optText);
            makeOption.innerHTML = optText;
            makeSelect.appendChild(makeOption);
        }
        selectLi.appendChild(makeSelect);
    }

    function getRadio(){
        var radios = document.forms[0].deadly;
        for(var i = 0; i < radios.length; i++){
            if (radios[i].checked){
                sex = radios[i].value;
            }
        }
    }

    function getCheckbox(){
        if($('fav').checked){
            partyLeader = $('fav').value;
        } else {
            partyLeader = "No"
        }
    }

    function toggleControls(n){
        switch(n){
            case "on":
                $("heroForm").style.display = "none";
                $('clearData').style.display = "inline";
                $("displayData").style.display = "none";
                $("addNew").style.display = "inline";
                break;
            case "off":
                $("heroForm").style.display = "block";
                $('clearData').style.display = "inline";
                $("displayData").style.display = "inline";
                $("addNew").style.display = "none";
                $("items").style.display = "none";
                break;
            default:
                return false;
        }
    }

    function validate(e){
        var getHeroName = $("wn");
        var getHeroClass = $("heroes");
        var getDate = $("date");

        errMsg.innerHTML = "";
        getHeroName.style.border = "1px solid black";
        getHeroClass.style.border = "1px solid black";
        getDate.style.border = "1px solid black";

        var messageArray = [];

        if(getHeroName.value === ""){
            var heroNameError = "Please enter heroes name.";
            getHeroName.style.border = "1px solid red";
            messageArray.push(heroNameError);
        }

        if(getHeroClass.value === "--Weapon Category--"){
            var heroClassError = "Please choose a hero class.";
            getHeroClass.style.border = "1px solid red";
            messageArray.push(heroClassError);
        }

      

        if(getDate.value === ""){
            var dateError = "Please enter today's date.";
            getDate.style.border = "1px solid red";
            messageArray.push(dateError);
        }

        if(messageArray.length >= 1){
            for(var i = 0, j = messageArray.length; i < j; i++){
                var text = document.createElement("li");
                text.innerHTML = messageArray[i];
                errMsg.appendChild(text);
            }
            e.preventDefault();
            return false;
        } else {
            storeData(this.key);
        }
    }

    function storeData(key){
        if(!key){
            var id = Math.floor(Math.random()*100000001);
        } else {
            id = key;
        }
        getRadio();
        getCheckbox();
        var item = {};
            
            item.heroName = ["Hero Name:", $("wn").value];
            item.heroClass = ["Hero Class:", $("heroes").value];
            item.deadly = ["Gender:", sex];
            item.pLeader = ["Leader:", partyLeader];
            item.age = ["Age:", $("weapon").value];
            item.otherDetails = ["Other Details:", $("comments").value];
            item.date = ["Hero Added:", $("date").value];
        localStorage.setItem(id, JSON.stringify(item));
        alert("Hero Added!");
    }

function getData(){
        toggleControls("on");
        if(localStorage.length === 0){
            alert("There are no characters in the party.");
        }
        var makeDiv = document.createElement("div");
        makeDiv.setAttribute("id", "items");
        var makeList = document.createElement("ul");
        makeDiv.appendChild(makeList);
        document.body.appendChild(makeDiv);
        $("items").style.display = "block";
        for(var i = 0, len=localStorage.length; i < len; i++){
            var makeli = document.createElement("li");
            var linksLi = document.createElement("li");
            makeList.appendChild(makeli);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var obj = JSON.parse(value);
            var makeSubList = document.createElement("ul");
            makeli.appendChild(makeSubList);
            for(var n in obj){
                var makeSubli = document.createElement("li");
                makeSubList.appendChild(makeSubli);
                var optSubText = obj[n][0] + " " + obj[n][1];
                makeSubli.innerHTML = optSubText;
                makeSubList.appendChild(linksLi);
            }
            makeItemLinks(localStorage.key(i), linksLi)
        }
    }

    function makeItemLinks(key, linksLi){
        var editLink = document.createElement("a");
        editLink.href = "#";
        editLink.key = key;
        var editText = "Edit Hero";
        editLink.addEventListener("click", editItem);
        editLink.innerHTML = editText;
        linksLi.appendChild(editLink);

        var breakTag = document.createElement('br');
        linksLi.appendChild(breakTag);

        var deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.key = key;
        var deleteText = "Delete Hero";
        deleteLink.addEventListener("click", deleteItem);
        deleteLink.innerHTML = deleteText;
        linksLi.appendChild(deleteLink);
    }

    function editItem(){
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);

        toggleControls("off");

        $("wn").value = item.heroName[1];
        $("heroes").value = item.heroClass[1];
        var radios = document.forms[0].deadly;
        for(var i = 0; i < radios.length; i++){
            if(radios[i].value == "Yes" && item.deadly[1] == "Yes"){
                radios[i].setAttribute("checked", "checked");
            } else if(radios[i].value == "No" && item.deadly[1] == "No"){
                radios[i].setAttribute("checked", "checked");
            } else if(radios[i].value == "Unknown" && item.deadly[1] == "Unknown"){
                radios[i].setAttribute("checked", "checked");
            }
        }
        if(item.pLeader[1] == "Yes"){
            $('fav').setAttribute("checked", "checked");
        }
        $("weapon").value = item.age[1];
        $("comments").value = item.otherDetails[1];
        $("date").value = item.date[1];

        saveData.removeEventListener("click", storeData);

        $("saveData").value = "Edit Hero";
        var editSubmit = $("saveData");

        editSubmit.addEventListener("click", validate);
        editSubmit.key = this.key;
    }

    function deleteItem(){
        var ask = confirm("Are you sure you want to remove this character");
        if(ask){
            localStorage.removeItem(this.key);
            alert("Hero was removed from the party.");
            window.location.reload();
        } else {
            alert("Hero was not removed from the party.");
        }
    }

    function eraseData(){
        if(localStorage.length === 0){
            alert("There are no characters in the party.");
        } else {
            localStorage.clear();
            alert("The Party has been erased.");
            window.location.reload();
            return false;
        }
    }
    
    var heroClass = ["--Hero Class--", "Barbarian", "Mage", "Voodoo Tribesman", "Assassin", "Monk", "Druid", "Bard", "Necromancer", "Other"],
       sex,
        partyLeader = "No",
        //usesValue,
        errMsg = $("errors");

    makeSelect();

    var saveData = $("saveData");
    saveData.addEventListener("click", validate);
    var displayData = $("displayData");
    displayData.addEventListener("click", getData);
    var clearData = $("clearData");
    clearData.addEventListener("click", eraseData);

});