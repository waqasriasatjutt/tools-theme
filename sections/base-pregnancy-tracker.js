/* Pregnancy Tracker runtime — Three.js 3D scene + 40-week content + Q&A
 * Loads Three.js from CDN (skypack) on first instance. Vanilla otherwise.
 * Self-contained: no API calls; "AI" Q&A is a curated keyword router with
 * scaffolded space to swap in an LLM backend later.
 */
(function () {
  // ── 40-week content database ─────────────────────────────────────
  // Fields: size (familiar comparison), length (cm), weight (g), development,
  // symptoms (mother), tip.
  var WEEKS = {
    4:  { size: "poppy seed",       length: 0.2,  weight: 0,    development: "Implantation complete. Embryonic disc forms. Heart and brain start to develop from the embryonic disk.", symptoms: "Missed period. Possible early signs: fatigue, breast tenderness, mild cramping, faint nausea.", tip: "Start a prenatal vitamin with folic acid (400 mcg) if you haven't already. Avoid alcohol and unpasteurized foods." },
    5:  { size: "sesame seed",      length: 0.3,  weight: 0,    development: "Neural tube forms. Heart begins beating around day 22-23. Tiny limb buds appear.", symptoms: "Tender breasts, fatigue, frequent urination, mood swings, food aversions.", tip: "Book your first prenatal appointment for around weeks 8-10." },
    6:  { size: "sweet pea",        length: 0.5,  weight: 0,    development: "Heart can be seen on ultrasound. Facial features beginning. Tiny buds for arms and legs.", symptoms: "Morning sickness (any time of day), heightened sense of smell, breast changes.", tip: "Stay hydrated. Small frequent meals help with nausea — crackers by the bed for morning." },
    7:  { size: "blueberry",        length: 0.9,  weight: 0,    development: "Brain grows fast. Hands and feet forming. Tiny tongue and eye lenses developing.", symptoms: "Continued nausea, food aversions, exhaustion. Some report increased saliva.", tip: "Ginger tea, vitamin B6, or doctor-approved anti-nausea meds can help with severe morning sickness." },
    8:  { size: "raspberry",        length: 1.6,  weight: 1,    development: "Fingers and toes webbed but distinct. Eyelids forming. Heart now has four chambers.", symptoms: "Bloating, mild backache, breast tenderness, mood swings, fatigue.", tip: "Your first ultrasound is often around this week — confirms heartbeat and dating." },
    9:  { size: "cherry",           length: 2.3,  weight: 2,    development: "Now officially a fetus. Tiny muscles form. Embryonic tail disappears. Earlobes start showing.", symptoms: "Visible breast veins, dizziness on standing, food cravings starting.", tip: "Begin doing gentle Kegel exercises — strengthens pelvic floor for delivery and postpartum recovery." },
    10: { size: "strawberry",       length: 3.1,  weight: 4,    development: "All vital organs formed. Fingernails growing. Limbs can bend at joints. Vocal cords forming.", symptoms: "Nausea may ease, energy slightly improves. Round ligament stretching may cause sharp pulls.", tip: "Look into your insurance coverage and decide on a maternity provider (OB-GYN, midwife, family doctor)." },
    11: { size: "lime",             length: 4.1,  weight: 7,    development: "Bone hardening begins. Hair follicles forming. Hands open and close into tiny fists.", symptoms: "Increased appetite as nausea fades. Belly may start to show in second pregnancies.", tip: "Consider non-invasive prenatal testing (NIPT) — can check for chromosomal conditions and reveal sex." },
    12: { size: "plum",             length: 5.4,  weight: 14,   development: "Reflexes develop. Can suck thumb. Kidneys produce urine. Vocal cords complete.", symptoms: "Morning sickness usually starts fading. Energy returns. Visible bump for some.", tip: "End of first trimester! Risk of miscarriage drops significantly. Many people share news around now." },
    13: { size: "lemon",            length: 7.4,  weight: 23,   development: "Fingerprints forming. Vocal cords developing. Intestines move into the abdomen.", symptoms: "Second-trimester energy boost. Skin changes (linea nigra darkening, melasma).", tip: "Schedule your second-trimester anatomy scan ultrasound (usually 18-22 weeks)." },
    14: { size: "peach",            length: 8.7,  weight: 43,   development: "Liver makes bile, spleen makes red blood cells. Hair starts growing.", symptoms: "Less nausea, more energy. Breast growth continues. Belly is rounding out.", tip: "Begin researching prenatal yoga or low-impact exercise classes safe for pregnancy." },
    15: { size: "apple",            length: 10.1, weight: 70,   development: "Bones harden, taste buds form. Baby can sense light through closed eyelids.", symptoms: "Mood swings stabilize. Nasal congestion (pregnancy rhinitis). Increased appetite.", tip: "Talk to your partner about what kind of birth experience you both want — early conversations matter." },
    16: { size: "avocado",          length: 11.6, weight: 100,  development: "Eyes can move side to side. Heart pumps 25 quarts of blood a day. Sex can usually be determined on ultrasound.", symptoms: "First flutters of movement ('quickening') may be felt. Round ligament pain. Glowing skin.", tip: "Sleep on your left side to optimize blood flow to baby. Pregnancy pillows help a lot." },
    17: { size: "pear",             length: 13.0, weight: 140,  development: "Skeleton hardening from cartilage to bone. Fat starts to form. Umbilical cord strengthens.", symptoms: "Stronger and more frequent baby movements. Belly is clearly showing. Lower back ache.", tip: "Start a pregnancy journal — milestones, feelings, photos. You'll cherish them later." },
    18: { size: "bell pepper",      length: 14.2, weight: 190,  development: "Hearing develops. Talk and sing — baby can hear you. Genitalia clearly visible.", symptoms: "Bigger appetite. Possible leg cramps at night. Heartburn may start.", tip: "Schedule the anatomy scan if not already — it's the most detailed ultrasound of pregnancy." },
    19: { size: "mango",            length: 15.3, weight: 240,  development: "Vernix caseosa (waxy coating) covers baby. Hair growing. Brain forms specialized areas for senses.", symptoms: "Stretching skin may itch. Hip and back pain. Vivid dreams.", tip: "Start applying a thick moisturizer to belly, hips, breasts to help with stretch mark itchiness." },
    20: { size: "banana",           length: 16.4, weight: 300,  development: "Halfway there! Baby practices swallowing. Hair, fingernails forming. Begins producing meconium.", symptoms: "Strong movements. Visible kicks from outside. Belly button may start to pop out.", tip: "Anatomy scan ultrasound week. You can usually find out sex if you want to. Take photos of the scan!" },
    21: { size: "carrot",           length: 26.7, weight: 360,  development: "Eyebrows and eyelids fully formed. Bone marrow makes blood cells. Can taste foods through amniotic fluid.", symptoms: "Round ligament pain. Some shortness of breath. Faster hair and nail growth.", tip: "Eat a varied diet — what you taste, baby tastes. Helps shape food preferences after birth." },
    22: { size: "spaghetti squash", length: 27.8, weight: 430,  development: "Senses developing rapidly. Grip is strong. Sleep-wake cycles begin.", symptoms: "Heartburn, indigestion. Braxton Hicks contractions may start. Stronger nesting urge.", tip: "Begin prenatal classes if you want them (childbirth, breastfeeding, infant CPR) — they fill up fast." },
    23: { size: "large mango",      length: 28.9, weight: 500,  development: "Lungs developing. Blood vessels of lungs growing. Hearing fully developed.", symptoms: "Swelling in feet and ankles, possible varicose veins, skin changes (acne, glow, or both).", tip: "If working, talk to HR about maternity leave logistics, accommodations, and return-to-work plans." },
    24: { size: "ear of corn",      length: 30.0, weight: 600,  development: "Lungs forming surfactant. Brain growing fast. Viability milestone — neonatal care possible if early birth.", symptoms: "Stronger movements, bigger belly. Possible glucose screening for gestational diabetes coming up.", tip: "Glucose tolerance test usually scheduled around week 24-28. Eat normally before; results guide diet." },
    25: { size: "rutabaga",         length: 34.6, weight: 660,  development: "Increasingly responsive to sound and touch. Capillaries forming under skin.", symptoms: "Sore back, sciatic pain possible. Pregnancy brain (forgetfulness) is real.", tip: "Drink lots of water — dehydration causes Braxton Hicks and can be confused with real contractions." },
    26: { size: "scallion",         length: 35.6, weight: 760,  development: "Eyes start opening. Detects light. Spinal nerves fully developed. Memory may be forming.", symptoms: "Heartburn worsens for many. Pelvic pressure. Possible higher blood pressure (monitor).", tip: "Start packing a hospital bag — even if it's months away, it relieves the panic later. Add chargers." },
    27: { size: "head of cauliflower", length: 36.6, weight: 875, development: "Third trimester begins! Lungs maturing rapidly. Sleeps and dreams. Brain very active.", symptoms: "Frequent urination returns. Restless legs. Shortness of breath. Bigger appetite.", tip: "Start counting kicks every day — usually 10+ kicks in 2 hours of focused attention. Tell doctor if patterns change." },
    28: { size: "eggplant",         length: 37.6, weight: 1000, development: "Brain develops rapidly with billions of new neurons. Can blink. Eyelashes formed.", symptoms: "Tdap booster vaccine recommended this week. Increased vaginal discharge, Braxton Hicks.", tip: "Ask about Tdap, RSV monoclonal antibody, and flu vaccines — protect newborn through maternal antibodies." },
    29: { size: "butternut squash", length: 38.6, weight: 1150, development: "Eyes can move. Reaches toward sounds. Forming the brown fat that keeps newborns warm.", symptoms: "Hemorrhoids may appear. Constipation. Trouble finding comfortable sleep positions.", tip: "Eat more fiber and drink water to keep things moving. Stool softeners (doctor-approved) may help." },
    30: { size: "large cabbage",    length: 39.9, weight: 1320, development: "Hair growing or developed. Bone marrow has taken over red-blood-cell production. Eyes can focus.", symptoms: "Sleep elusive. Carpal tunnel symptoms in hands possible from fluid retention.", tip: "Consider a birth plan template — discuss preferences but stay flexible. Birth rarely goes exactly to plan." },
    31: { size: "coconut",          length: 41.1, weight: 1500, development: "All five senses working. Can turn head from side to side. Major brain growth.", symptoms: "Stronger Braxton Hicks. Leakage of colostrum from breasts. Heartburn, reflux.", tip: "Start interviewing pediatricians — most do a 'meet and greet' free. Newborn appointment is within days of birth." },
    32: { size: "jicama",           length: 42.4, weight: 1700, development: "Fingernails grown. Practicing breathing. Bones harden (except skull, which stays soft for birth).", symptoms: "Frequent contractions practice. Sleep on left side. Itchy belly. Possible heart palpitations.", tip: "Final OB visits become every 2 weeks. Track baby movement daily — fewer than 10 kicks in 2 hours = call doctor." },
    33: { size: "pineapple",        length: 43.7, weight: 1920, development: "Coordinated movements. Immune system developing. Skin smoother and pinker.", symptoms: "Stronger pelvic pressure. Lightning crotch (sharp nerve pain). Trouble sleeping.", tip: "Wash baby clothes/blankets in fragrance-free detergent before use. Set up nursery basics." },
    34: { size: "cantaloupe",       length: 45.0, weight: 2150, development: "Vernix thickens. Fingernails reach tips. Eyes blink. Practice breathing intensifying.", symptoms: "Belly button completely out. Crampy contractions. Mood ranges wildly.", tip: "Install the car seat now and have it checked at a fire station or by a certified passenger safety technician." },
    35: { size: "honeydew melon",   length: 46.2, weight: 2380, development: "Kidneys fully developed. Liver can process some waste. Putting on weight rapidly.", symptoms: "Pelvic pressure intensifies. GBS (group B strep) test around now. Anxiety + excitement.", tip: "Pack hospital bag NOW if not done. Include phone chargers, snacks, comfortable clothes, ID, insurance card." },
    36: { size: "papaya",           length: 47.4, weight: 2620, development: "Considered early-term. Sucks thumb. Coordinates sucking and swallowing. Practice breathing fully.", symptoms: "Mucus plug may pass (clear to bloody discharge). Baby drops lower into pelvis ('lightening').", tip: "Weekly OB visits begin. Discuss any concerns about labor signs vs. false labor with your provider." },
    37: { size: "winter melon",     length: 48.6, weight: 2860, development: "Early term: lungs nearly mature. Practicing breathing motions. Brain still developing rapidly.", symptoms: "Pelvic pain, frequent urination, light contractions. Burst of energy ('nesting').", tip: "Know the difference between Braxton Hicks (irregular) and real labor (regular, intensifying, won't stop)." },
    38: { size: "leek",             length: 49.8, weight: 3080, development: "Vocal cords full. Vernix mostly gone. Major brain development continuing.", symptoms: "Sleep loss. Anxiety. Heightened anticipation. Possible rupture of membranes (water breaking).", tip: "Watch for: regular contractions 5-1-1 (every 5 min, lasting 1 min, for 1 hour), water breaking, bleeding." },
    39: { size: "watermelon",       length: 50.7, weight: 3290, development: "Full term! All organs ready. Shedding vernix. Still gaining ~30g per day.", symptoms: "Very heavy. Walking like a duck. Strong Braxton Hicks. Cervix may start dilating.", tip: "Rest as much as possible. Do gentle walks. Eat dates (associated with shorter labor, gentler dilation)." },
    40: { size: "small pumpkin",    length: 51.2, weight: 3460, development: "Due date! Brain getting big enough to fold. Lungs continue to mature. Ready when ready.", symptoms: "Patience may be thin. Common to go up to 42 weeks. Watch for labor signs.", tip: "Only 5% of babies arrive on due date. Stay calm and trust the process. Call provider with any concerns." },
  };

  function clampWeek(w) { w = parseInt(w, 10) || 20; return Math.max(4, Math.min(40, w)); }
  function weekData(w) { w = clampWeek(w); return WEEKS[w] || WEEKS[Math.max(4, Math.min(40, Math.round(w)))]; }
  function trimester(w) { w = clampWeek(w); return w <= 13 ? "1st (1-13)" : (w <= 27 ? "2nd (14-27)" : "3rd (28-40)"); }

  // ── Due-date calculator ──────────────────────────────────
  function calcFromLMP(lmpStr, cycleLen) {
    var lmp = new Date(lmpStr);
    if (isNaN(lmp.getTime())) return null;
    var luteal = 14, cycleAdjust = (cycleLen - 28);
    var ovulation = new Date(lmp.getTime() + (cycleAdjust * 24 * 3600 * 1000));
    var due = new Date(lmp.getTime() + (280 * 24 * 3600 * 1000));  // Naegele's
    if (cycleLen !== 28) due = new Date(due.getTime() + (cycleAdjust * 24 * 3600 * 1000));
    var today = new Date(); today.setHours(0,0,0,0);
    var daysPreg = Math.floor((today - lmp) / (24 * 3600 * 1000));
    var weeksPreg = Math.max(0, daysPreg / 7);
    var daysLeft = Math.ceil((due - today) / (24 * 3600 * 1000));
    return { due: due, week: weeksPreg, days_left: daysLeft };
  }
  function calcFromConception(date) {
    var d = new Date(date);
    if (isNaN(d.getTime())) return null;
    var due = new Date(d.getTime() + (266 * 24 * 3600 * 1000));
    var today = new Date(); today.setHours(0,0,0,0);
    // Conception ~= 2 weeks post LMP
    var lmpEquiv = new Date(d.getTime() - (14 * 24 * 3600 * 1000));
    var daysPreg = Math.floor((today - lmpEquiv) / (24 * 3600 * 1000));
    var daysLeft = Math.ceil((due - today) / (24 * 3600 * 1000));
    return { due: due, week: daysPreg / 7, days_left: daysLeft };
  }
  function calcFromUltrasound(date, weeksAt) {
    var d = new Date(date);
    if (isNaN(d.getTime()) || !weeksAt) return null;
    var weeksRemain = 40 - weeksAt;
    var due = new Date(d.getTime() + (weeksRemain * 7 * 24 * 3600 * 1000));
    var today = new Date(); today.setHours(0,0,0,0);
    var daysSinceScan = Math.floor((today - d) / (24 * 3600 * 1000));
    var weekNow = weeksAt + (daysSinceScan / 7);
    var daysLeft = Math.ceil((due - today) / (24 * 3600 * 1000));
    return { due: due, week: weekNow, days_left: daysLeft };
  }
  function fmtDate(d) { return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"); }
  function fmtWeek(w) {
    var whole = Math.floor(w);
    var days = Math.floor((w - whole) * 7);
    return whole + "w" + (days ? " " + days + "d" : "");
  }

  // ── Three.js loader (one-time) ─────────────────────────────
  var threePromise = null;
  function loadThree() {
    if (threePromise) return threePromise;
    threePromise = new Promise(function (resolve, reject) {
      if (window.THREE) return resolve(window.THREE);
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js";
      script.onload = function () { resolve(window.THREE); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return threePromise;
  }

  // ── 3D scene per instance ──────────────────────────────────
  function setupScene(canvasEl, week) {
    return loadThree().then(function (THREE) {
      var scene = new THREE.Scene();
      var rect = canvasEl.getBoundingClientRect();
      var w = rect.width || 400, h = rect.height || 400;
      var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.set(0, 0, 5);
      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      canvasEl.innerHTML = "";
      canvasEl.appendChild(renderer.domElement);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      var key = new THREE.DirectionalLight(0xffffff, 0.7);
      key.position.set(3, 4, 5);
      scene.add(key);
      var rim = new THREE.PointLight(0xff88aa, 0.5);
      rim.position.set(-4, -2, -3);
      scene.add(rim);

      // Two meshes: outer placental sac (translucent), inner baby form.
      var sacMat = new THREE.MeshStandardMaterial({ color: 0xffd1d6, transparent: true, opacity: 0.18, roughness: 0.4 });
      var sac = new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 32), sacMat);
      scene.add(sac);

      var babyMat = new THREE.MeshStandardMaterial({ color: 0xffb3b3, roughness: 0.45, metalness: 0.05 });
      // Group of geometry that approximates a curled fetus: a small sphere (head) + an ellipsoid (body)
      var babyGroup = new THREE.Group();
      var head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 24), babyMat);
      head.position.set(0, 0.55, 0);
      babyGroup.add(head);
      var bodyGeom = new THREE.SphereGeometry(0.55, 32, 24);
      bodyGeom.scale(1.0, 1.3, 0.9);
      var body = new THREE.Mesh(bodyGeom, babyMat);
      body.position.set(0, -0.15, 0);
      babyGroup.add(body);
      // Tiny limbs
      function limb(x, y, z, rx, ry, rz) {
        var l = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12), babyMat);
        l.position.set(x, y, z);
        l.rotation.set(rx, ry, rz);
        babyGroup.add(l);
      }
      limb(0.45, 0.1, 0, 0, 0, -0.7);    // right arm
      limb(-0.45, 0.1, 0, 0, 0, 0.7);    // left arm
      limb(0.2, -0.75, 0, 0.4, 0, -0.2); // right leg
      limb(-0.2, -0.75, 0, 0.4, 0, 0.2); // left leg
      scene.add(babyGroup);

      // Initial scale: week 4 = 5% of full, week 40 = 100%.
      function scaleForWeek(week) {
        week = Math.max(4, Math.min(40, week));
        // Non-linear: small in early weeks, grows fast 8-20, slows 30-40
        var t = (week - 4) / 36;  // 0..1
        var eased = Math.pow(t, 0.55);
        return 0.12 + 0.88 * eased;  // 0.12 → 1.0
      }
      var currentScale = scaleForWeek(week);
      babyGroup.scale.setScalar(currentScale);

      // Drag-to-rotate
      var isDragging = false, lastX = 0, lastY = 0, rotY = 0.3, rotX = 0;
      renderer.domElement.addEventListener("pointerdown", function (e) { isDragging = true; lastX = e.clientX; lastY = e.clientY; renderer.domElement.setPointerCapture && renderer.domElement.setPointerCapture(e.pointerId); });
      renderer.domElement.addEventListener("pointermove", function (e) { if (!isDragging) return; rotY += (e.clientX - lastX) * 0.01; rotX += (e.clientY - lastY) * 0.01; rotX = Math.max(-1.2, Math.min(1.2, rotX)); lastX = e.clientX; lastY = e.clientY; });
      renderer.domElement.addEventListener("pointerup", function () { isDragging = false; });
      renderer.domElement.addEventListener("pointerleave", function () { isDragging = false; });

      // Resize
      var ro = new ResizeObserver(function () {
        var r = canvasEl.getBoundingClientRect();
        var nw = r.width || w, nh = r.height || h;
        renderer.setSize(nw, nh);
        camera.aspect = nw / nh; camera.updateProjectionMatrix();
      });
      try { ro.observe(canvasEl); } catch (_e) {}

      var time = 0;
      function frame() {
        time += 0.005;
        babyGroup.rotation.y = rotY + (isDragging ? 0 : Math.sin(time) * 0.06);
        babyGroup.rotation.x = rotX;
        babyGroup.position.y = Math.sin(time * 1.4) * 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
      }
      frame();

      return {
        setWeek: function (w) {
          currentScale = scaleForWeek(w);
          babyGroup.scale.setScalar(currentScale);
        },
      };
    }).catch(function (e) {
      canvasEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;text-align:center;padding:20px;">3D viewer failed to load. Week info still works.<br/><small>' + (e && e.message || e) + '</small></div>';
      return { setWeek: function () {} };
    });
  }

  // ── Q&A keyword router (rules-based for now) ──────────────
  function answer(question, week) {
    var q = (question || "").toLowerCase().trim();
    var wd = weekData(week);
    if (!q) return "Type a question or click a chip above.";
    var rules = [
      { match: /symptom|feeling|expect/, answer: "Common symptoms around week " + Math.floor(week) + ": " + wd.symptoms + "\n\nAlways tell your provider about sharp pain, heavy bleeding, severe headache, or sudden swelling — those can need urgent attention." },
      { match: /food|eat|avoid|diet|nutrition/, answer: "Foods to avoid throughout pregnancy: raw or undercooked meat/fish, unpasteurized dairy and juices, deli meats (unless reheated), high-mercury fish (swordfish, king mackerel), raw eggs, alcohol, and excessive caffeine (limit to ~200mg/day). Eat plenty of leafy greens, lean protein, whole grains, dairy/calcium, and stay hydrated.\n\nAt week " + Math.floor(week) + ", focus on iron-rich foods if you're nearing the third trimester." },
      { match: /appointment|visit|check.?up/, answer: "Typical prenatal visit schedule:\n• Weeks 4-28: every 4 weeks\n• Weeks 28-36: every 2 weeks\n• Weeks 36+: weekly until birth\n\nYou are around week " + Math.floor(week) + ". Key milestones: NIPT (10-12w), nuchal translucency (11-13w), anatomy scan (18-22w), glucose tolerance test (24-28w), GBS swab (~36w)." },
      { match: /exercise|workout|gym|run|yoga/, answer: "Safe exercise during a healthy pregnancy is encouraged — 150 min/week moderate activity is the standard recommendation. Walking, swimming, prenatal yoga, low-impact cycling, and light strength training are usually fine.\n\nAvoid: contact sports, anything with fall risk (skiing, horseback), hot yoga, lying flat on your back after week 20, and breath-holding. Stop if you feel dizzy, contractions, or pain." },
      { match: /travel|flight|fly|plane/, answer: "Most airlines allow flying until ~36 weeks for single pregnancies (32w for twins) but rules vary — check before booking. Best window is the second trimester (weeks 14-28) when nausea has faded but you're still comfortable.\n\nTips: walk every hour to reduce DVT risk, stay very hydrated, request an aisle seat, carry your records/insurance, avoid Zika areas." },
      { match: /kick|movement|flutter|feel/, answer: "First flutters ('quickening') usually felt:\n• First pregnancy: 18-22 weeks\n• Subsequent pregnancies: 16-18 weeks\n\nFrom about week 28, count kicks daily — usually 10+ movements in 2 hours of focused observation. Tell your provider if patterns change suddenly." },
      { match: /sleep|insomnia|rest/, answer: "Sleep tips for pregnancy:\n• Sleep on your left side (best blood flow to baby), use a pregnancy pillow between your knees\n• Avoid lying flat on your back after week 20\n• Limit fluids in the evening to reduce bathroom trips\n• Cool, dark room\n• Magnesium-rich foods or doctor-approved supplement may help leg cramps" },
      { match: /weight|gain/, answer: "Healthy total weight gain ranges (singleton pregnancy):\n• Underweight start: 28-40 lbs (12.5-18 kg)\n• Normal weight start: 25-35 lbs (11.5-16 kg)\n• Overweight start: 15-25 lbs (7-11.5 kg)\n• Obese start: 11-20 lbs (5-9 kg)\n\n1st trimester: ~1-4 lbs total. 2nd and 3rd: ~1 lb/week typical." },
      { match: /name|sex|gender/, answer: "Sex can usually be reliably seen via ultrasound by 18-22 weeks (anatomy scan). Non-invasive prenatal testing (NIPT) can reveal sex from a blood sample as early as week 10.\n\nNot getting an answer is totally normal — try again next scan, baby's position matters!" },
      { match: /hospital|bag|pack/, answer: "Hospital bag essentials:\n• ID, insurance card, birth plan copy\n• Phone + charger (long cable), camera\n• Comfy clothes for labor + going-home outfit\n• Toiletries, lip balm, hair ties, glasses\n• Slippers, robe, nursing bra, nipple cream\n• Going-home outfit for baby + car seat (already installed!)\n• Snacks, water bottle, light entertainment\n\nPack by week 35-36 — start of full-term." },
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].match.test(q)) return rules[i].answer;
    }
    return "I don't have a specific answer for that yet — but at week " + Math.floor(week) + ", here's what's most relevant:\n\n• Baby is the size of a " + wd.size + " (" + wd.length + " cm, ~" + wd.weight + "g)\n• Development: " + wd.development + "\n• Tip: " + wd.tip + "\n\nFor a medical question, please ask your provider.";
  }

  // ── Init one instance ───────────────────────────────────────
  function init(root) {
    if (!root || root.__ptReady) return;
    root.__ptReady = true;

    // Due date calculator
    var methodSel = root.querySelector(".pt-method");
    var dateInput = root.querySelector(".pt-date");
    var ultraWrap = root.querySelector(".pt-ultra-wrap");
    var ultraWeeks = root.querySelector(".pt-ultra-weeks");
    var cycleInput = root.querySelector(".pt-cycle");
    var dueOut = root.querySelector(".pt-due-date");
    var weekOut = root.querySelector(".pt-current-week");
    var triOut = root.querySelector(".pt-trimester");
    var daysOut = root.querySelector(".pt-days-left");

    function onMethodChange() {
      ultraWrap.hidden = methodSel.value !== "ultrasound";
    }
    methodSel.addEventListener("change", onMethodChange);

    function doCalc() {
      var method = methodSel.value;
      var date = dateInput.value;
      var cycle = parseInt(cycleInput.value, 10) || 28;
      var result = null;
      if (method === "lmp") result = calcFromLMP(date, cycle);
      else if (method === "conception") result = calcFromConception(date);
      else if (method === "ultrasound") result = calcFromUltrasound(date, parseFloat(ultraWeeks.value));
      if (!result) {
        dueOut.textContent = weekOut.textContent = triOut.textContent = daysOut.textContent = "—";
        return;
      }
      dueOut.textContent = fmtDate(result.due);
      weekOut.textContent = fmtWeek(result.week);
      triOut.textContent = trimester(result.week);
      daysOut.textContent = result.days_left;
      // Optionally jump the explorer slider to current week
      var wInt = clampWeek(Math.floor(result.week));
      slider.value = wInt; weekInputBox.value = wInt;
      updateWeek(wInt);
    }
    var bCalc = root.querySelector(".pt-calc-btn");
    var bToday = root.querySelector(".pt-today-btn");
    if (bCalc) bCalc.addEventListener("click", doCalc);
    if (bToday) bToday.addEventListener("click", function () {
      dateInput.value = fmtDate(new Date());
      doCalc();
    });

    // Week explorer
    var slider = root.querySelector(".pt-week-slider");
    var weekInputBox = root.querySelector(".pt-week-input");
    var weekBadge = root.querySelector(".pt-3d-week");
    var canvas = root.querySelector(".pt-3d-canvas");
    var bPrev = root.querySelector(".pt-week-prev");
    var bNext = root.querySelector(".pt-week-next");

    var infoWeekEl = root.querySelector(".pt-info-week");
    var sizeVal = root.querySelector(".pt-info-size-val");
    var lengthVal = root.querySelector(".pt-info-length-val");
    var weightVal = root.querySelector(".pt-info-weight-val");
    var devEl = root.querySelector(".pt-info-development");
    var sympEl = root.querySelector(".pt-info-symptoms");
    var tipEl = root.querySelector(".pt-info-tip");

    var sceneCtl = null;
    setupScene(canvas, parseInt(slider.value, 10)).then(function (ctl) { sceneCtl = ctl; updateWeek(parseInt(slider.value, 10)); });

    function updateWeek(w) {
      w = clampWeek(w);
      weekBadge.textContent = "Week " + w;
      infoWeekEl.textContent = "Week " + w;
      var d = weekData(w);
      sizeVal.textContent = d.size;
      lengthVal.textContent = d.length + " cm";
      weightVal.textContent = d.weight + " g";
      devEl.textContent = d.development;
      sympEl.textContent = d.symptoms;
      tipEl.textContent = d.tip;
      if (sceneCtl && sceneCtl.setWeek) sceneCtl.setWeek(w);
    }
    slider.addEventListener("input", function () { weekInputBox.value = slider.value; updateWeek(slider.value); });
    weekInputBox.addEventListener("input", function () { var v = clampWeek(weekInputBox.value); slider.value = v; updateWeek(v); });
    if (bPrev) bPrev.addEventListener("click", function () { var v = clampWeek(parseInt(slider.value,10)-1); slider.value=v; weekInputBox.value=v; updateWeek(v); });
    if (bNext) bNext.addEventListener("click", function () { var v = clampWeek(parseInt(slider.value,10)+1); slider.value=v; weekInputBox.value=v; updateWeek(v); });

    // Q&A
    var thread = root.querySelector(".pt-qa-thread");
    var input = root.querySelector(".pt-qa-input");
    var sendBtn = root.querySelector(".pt-qa-send");
    var chips = root.querySelectorAll(".pt-chip");

    function appendMsg(from, text) {
      var div = document.createElement("div");
      div.className = "pt-qa-msg pt-qa-" + (from === "you" ? "q" : "a");
      var fr = document.createElement("div"); fr.className = "pt-qa-msg-from"; fr.textContent = (from === "you" ? "You" : "Assistant");
      var p = document.createElement("p"); p.style.margin = "0"; p.style.whiteSpace = "pre-wrap"; p.textContent = text;
      div.appendChild(fr); div.appendChild(p);
      thread.insertBefore(div, thread.firstChild);
    }
    function ask(q) {
      if (!q) return;
      appendMsg("you", q);
      var a = answer(q, parseInt(slider.value, 10) || 20);
      setTimeout(function () { appendMsg("assistant", a); }, 250);
      input.value = "";
    }
    sendBtn.addEventListener("click", function () { ask(input.value.trim()); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); ask(input.value.trim()); } });
    chips.forEach(function (c) { c.addEventListener("click", function () { ask(c.getAttribute("data-q") || c.textContent); }); });
  }

  function boot() { document.querySelectorAll(".pregnancy-tracker").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
