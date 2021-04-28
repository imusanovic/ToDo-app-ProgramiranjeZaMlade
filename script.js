  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBzTilqrwliEIgLkhR_ZFvr3oKfE3-Ds5k",
    authDomain: "todo-8b222.firebaseapp.com",
    projectId: "todo-8b222",
    storageBucket: "todo-8b222.appspot.com",
    messagingSenderId: "356838604385",
    appId: "1:356838604385:web:b12eb52f2a15ce19df7420"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
	
	let form = document.getElementById("form");
	let lista = document.getElementById("lista");
	
	const prikaziZadatke = () => {
		lista.innerHTML = "";	
		zadaci = [];
		firebase.database().ref("nedovrseni").once("value", (snapshot) => {
			snapshot.forEach((dijeteSnapshot) => {
				let dijeteKey = dijeteSnapshot.key;
				let dijetePodaci = dijeteSnapshot.val();
				zadaci.push(Object.values(dijetePodaci));
			});
			for(let i = 0; i < zadaci.length; i++){
				let zadatakKey = zadaci[i][0];
				let zadatakNaziv = zadaci[i][1];
				let zadatakOpis = zadaci[i][2];
				
				let li = document.createElement("li");
				li.setAttribute("class", "item");
				li.setAttribute("data-key", zadatakKey);
				let html = `<h3><span>${zadatakNaziv}</span><span class="razmak"><a onclick="edit(this.parentElement.parentElement.parentElement, this)" href="#"><i class="fa fa-edit"></i></a><a onclick="del(this.parentElement.parentElement.parentElement)" href="#"><i class="far fa-trash-alt"></i></a><a onclick="done(this.parentElement.parentElement.parentElement, this.children[0])" href="#"><i class=\"far fa-square"></i></a></span></h3><p class="opis">${zadatakOpis}</p>`;
				li.innerHTML = html;
				lista.append(li);
				if(i < zadaci.length - 1){
					let hr = document.createElement("hr");
					lista.append(hr);
				}
			}
	});
}

// spajanje na firebae i prikaz zadataka
prikaziZadatke();
	
form.addEventListener("submit", e => {
	e.preventDefault();
	
	if(form.naziv.value.length > 0){
		let key = firebase.database().ref().child("nedovrseni").push().key;
		let zadatak = {
			naziv: form.naziv.value,
			opis: form.opis.value,
			key: key
		}
		
		let updates = {};
		updates["/nedovrseni/" + key] = zadatak;
		firebase.database().ref().update(updates);
		prikaziZadatke();
	}
});

const done = (parent, child) => {
		parent.classList.toggle("done");
		child.classList.toggle("fa-square");
		child.classList.toggle("fa-check-square");
		console.log(parent.classList);
}

const del = parent => {
		let key = parent.getAttribute("data-key");
		let zadatakZaObrisati = firebase.database().ref("/nedovrseni/" + key);
	  zadatakZaObrisati.remove();
		parent.nextElementSibling.remove();
		parent.remove();
}

const edit = (parent, child) => {
		child.setAttribute("onclick", "finishEdit(this.parentElement.parentElement.parentElement, this)");
		child.children[0].classList.remove("fa-edit");
		child.children[0].classList.add("fa-check");
		let naslov = parent.children[0].children[0];
		let opis = parent.children[1];
		naslov.setAttribute("contenteditable", true);
		opis.setAttribute("contenteditable", true);
}

const finishEdit = (parent, child) => {
		child.setAttribute("onclick", "edit(this.parentElement.parentElement.parentElement, this)");
		child.children[0].classList.add("fa-edit");
		child.children[0].classList.remove("fa-check");
		let naslov = parent.children[0].children[0];
		let opis = parent.children[1];
		let key = parent.getAttribute("data-key");
		naslov.setAttribute("contenteditable", false);
		opis.setAttribute("contenteditable", false);
		
		let zadatak = {
			naziv: naslov.innerHTML,
			opis: opis.innerHTML,
			key: key
		}
		
		let updates = {};
		updates["/nedovrseni/" + key] = zadatak;
		firebase.database().ref().update(updates);
}