let records = JSON.parse(localStorage.getItem('siteInspections')) || [];

function displayRecords() {
    const list = document.getElementById('recordsList');
    list.innerHTML = '';
    if (records.length === 0) {
        list.innerHTML = '<p>अजून कोणतीही नोंद नाही.</p>';
        return;
    }
    records.forEach((record, index) => {
        const div = document.createElement('div');
        div.className = 'record-item';
        let imgTag = '';
        if (record.photo) {
            imgTag = `<img src="${record.photo}" alt="फोटो">`;
        }
        div.innerHTML = `
            <strong>${record.siteName} (${record.type})</strong>
            <p>${record.remarks || 'काही नोंद नाही'}</p>
            ${imgTag}
            <small>${record.date}</small>
            <button onclick="deleteRecord(${index})" style="background: #dc3545; width: auto; padding: 5px 10px; font-size: 12px; margin-top: 10px;">हटवा</button>
        `;
        list.appendChild(div);
    });
}

document.getElementById('inspectionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const siteName = document.getElementById('siteName').value;
    const select = document.getElementById('inspectionType');
    const type = select.options[select.selectedIndex].text;
    const remarks = document.getElementById('remarks').value;
    const photoInput = document.getElementById('photo');

    const saveRecord = (photoData) => {
        const newRecord = {
            siteName: siteName,
            type: type,
            remarks: remarks,
            photo: photoData,
            date: new Date().toLocaleString('mr-IN')
        };
        records.push(newRecord);
        localStorage.setItem('siteInspections', JSON.stringify(records));
        document.getElementById('inspectionForm').reset();
        displayRecords();
    };

    if (photoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            saveRecord(ev.target.result);
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        saveRecord('');
    }
});

function deleteRecord(index) {
    records.splice(index, 1);
    localStorage.setItem('siteInspections', JSON.stringify(records));
    displayRecords();
}

displayRecords();
