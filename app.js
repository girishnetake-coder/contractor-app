<!DOCTYPE html>
<html lang="mr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>कंट्रॅक्टर ॲप</title>
    <style>
        body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f0f2f5; color: #333; }
        .screen { padding: 20px; max-width: 500px; margin: auto; }
        #loginScreen { text-align: center; margin-top: 50px; background: white; padding: 30px 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
        button { width: 100%; padding: 15px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; background-color: #007bff; color: white; font-weight: bold; }
        button:hover { background-color: #0056b3; }
        header { display: flex; justify-content: space-between; align-items: center; background: #007bff; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        header h2 { margin: 0; font-size: 18px; }
        .logout-btn { width: auto; padding: 8px 12px; background: #dc3545; font-size: 14px; }
        .view { display: none; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .view h3 { margin-top: 0; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .action-btn { margin-top: 15px; background: #28a745; }
        .action-btn:hover { background: #218838; }
        .report-btn { background: #ff9800; margin-top: 10px; }
        .report-btn:hover { background: #e68a00; }
        .worker-card { background: #f9f9f9; border-left: 4px solid #28a745; padding: 10px; margin-bottom: 10px; border-radius: 4px; }
        .worker-card strong { display: block; font-size: 16px; color: #333; }
        .worker-card span { font-size: 14px; color: #666; }
        #statusMsg { color: green; font-weight: bold; text-align: center; margin-top: 10px; display: none; }
    </style>
</head>
<body>

    <!-- लॉगिन स्क्रीन -->
    <div id="loginScreen" class="screen">
        <h1>🏗️ कंट्रॅक्टर ॲप</h1>
        <p>तुमची भूमिका निवडा (Role)</p>
        <input type="text" id="userName" placeholder="तुमचे नाव टाका">
        <select id="userRole">
            <option value="owner">मालक (Owner)</option>
            <option value="field_officer">फिल्ड ऑफिसर</option>
            <option value="supervisor">सुपरवायझर</option>
            <option value="worker">कामगार</option>
        </select>
        <button onclick="login()">लॉगिन करा</button>
    </div>

    <!-- मुख्य ॲप स्क्रीन -->
    <div id="appScreen" class="screen" style="display: none;">
        <header>
            <h2 id="welcomeText">नमस्कार,</h2>
            <button class="logout-btn" onclick="logout()">बाहेर पडा</button>
        </header>

        <!-- अधिकाऱ्यांसाठी स्क्रीन (मालक, फिल्ड ऑफिसर, सुपरवायझर) -->
        <div id="officerView" class="view">
            <h3>📊 अधिकारी डॅशबोर्ड</h3>
            <p>आज कामावर हजर असलेले कामगार आणि त्यांचे पॉईंट:</p>
            <div id="attendanceList"><p>अजून कोणीही हजेरी लावलेली नाही.</p></div>
            
            <button class="action-btn report-btn" onclick="showReport()">📄 दैनंदिन अहवाल (Daily Report)</button>
        </div>

        <!-- कामगारासाठी स्क्रीन -->
        <div id="workerView" class="view">
            <h3>👷 कामगार हजेरी</h3>
            <p>कृपया तुमची माहिती भरा आणि फोटो काढा.</p>
            
            <input type="text" id="wName" placeholder="कामगाराचे नाव">
            <input type="tel" id="wMobile" placeholder="मोबाईल नंबर">
            <input type="text" id="wPoint" placeholder="पॉईंटचे नाव (उदा. साइट A)">
            
            <button class="action-btn" onclick="takeAttendance()">📸 हजेरी (फोटो काढा)</button>
            <div id="statusMsg">✅ हजेरी यशस्वी झाली!</div>
        </div>

    </div>

    <script>
        // लॉगिन फंक्शन
        function login() {
            const name = document.getElementById('userName').value;
            const role = document.getElementById('userRole').value;

            if (name === "") {
                alert("कृपया तुमचे नाव टाका!");
                return;
            }

            localStorage.setItem('userName', name);
            localStorage.setItem('userRole', role);
            showDashboard(name, role);
        }

        // डॅशबोर्ड दाखवणे
        function showDashboard(name, role) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appScreen').style.display = 'block';
            
            document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
            document.getElementById('welcomeText').innerText = `नमस्कार, ${name}`;

            if (role === 'worker') {
                document.getElementById('workerView').style.display = 'block';
            } else {
                // मालक, फिल्ड ऑफिसर, सुपरवायझर सर्वांना हाच व्यू दिसेल
                document.getElementById('officerView').style.display = 'block';
                loadAttendance(); // हजेरीची यादी लोड करा
            }
        }

        // लॉगआउट
        function logout() {
            localStorage.clear();
            location.reload();
        }

        // कामगार हजेरी फंक्शन
        function takeAttendance() {
            const name = document.getElementById('wName').value;
            const mobile = document.getElementById('wMobile').value;
            const point = document.getElementById('wPoint').value;

            if (name === "" || mobile === "" || point === "") {
                alert("कृपया सर्व माहिती भरा!");
                return;
            }

            // कॅमेरा उघडणे
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    // डेटा सेव्ह करणे (लोकेशन बॅकएंडला जाते, कामगाराला दिसत नाही)
                    const newRecord = {
                        name: name,
                        mobile: mobile,
                        point: point,
                        time: new Date().toLocaleTimeString('mr-IN'),
                        date: new Date().toLocaleDateString('mr-IN')
                    };

                    let records = JSON.parse(localStorage.getItem('attendanceData')) || [];
                    records.push(newRecord);
                    localStorage.setItem('attendanceData', JSON.stringify(records));

                    // यशस्वी मेसेज दाखवणे (लोकेशनचा उल्लेख न करता)
                    document.getElementById('statusMsg').style.display = 'block';
                    
                    // फॉर्म रिकामा करणे
                    document.getElementById('wName').value = '';
                    document.getElementById('wMobile').value = '';
                    document.getElementById('wPoint').value = '';

                    setTimeout(() => {
                        document.getElementById('statusMsg').style.display = 'none';
                    }, 3000);
                }
            };
            input.click();
        }

        // अधिकाऱ्यांसाठी हजेरी लोड करणे
        function loadAttendance() {
            const listDiv = document.getElementById('attendanceList');
            let records = JSON.parse(localStorage.getItem('attendanceData')) || [];

            if (records.length === 0) {
                listDiv.innerHTML = '<p>अजून कोणीही हजेरी लावलेली नाही.</p>';
                return;
            }

            listDiv.innerHTML = '';
            // उलट क्रमाने (नवीन आधी) दाखवणे
            records.reverse().forEach(rec => {
                const card = document.createElement('div');
                card.className = 'worker-card';
                card.innerHTML = `
                    <strong>${rec.name} (${rec.mobile})</strong>
                    <span>📍 पॉईंट: ${rec.point}</span><br>
                    <span>⏰ वेळ: ${rec.time} | 📅 दिनांक: ${rec.date}</span>
                `;
                listDiv.appendChild(card);
            });
        }

        // दैनंदिन अहवाल (Daily Report)
        function showReport() {
            let records = JSON.parse(localStorage.getItem('attendanceData')) || [];
            if (records.length === 0) {
                alert("आज कोणतीही हजेरी नाही.");
                return;
            }

            let reportText = "--- दैनंदिन अहवाल ---\n\n";
            let pointCounts = {};

            records.forEach(rec => {
                reportText += `नाव: ${rec.name} | पॉईंट: ${rec.point} | वेळ: ${rec.time}\n`;
                pointCounts[rec.point] = (pointCounts[rec.point] || 0) + 1;
            });

            reportText += "\n--- पॉईंटनुसार एकूण हजेरी ---\n";
            for (let pt in pointCounts) {
                reportText += `${pt}: ${pointCounts[pt]} कामगार\n`;
            }

            alert(reportText);
        }

        // पेज लोड झाल्यावर लॉगिन तपासा
        window.onload = function() {
            const savedName = localStorage.getItem('userName');
            const savedRole = localStorage.getItem('userRole');
            if (savedName && savedRole) {
                showDashboard(savedName, savedRole);
            }
        };
    </script>
</body>
</html>
