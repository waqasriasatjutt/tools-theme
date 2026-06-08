(function () {
  var POOLS = {
    classic: "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum at vero eos accusamus iusto odio dignissimos ducimus blanditiis praesentium voluptatum deleniti atque corrupti quos dolores quas molestias excepturi obcaecati cupiditate similique mollitia animi laboriosam dolorum fuga harum quidem rerum facilis expedita distinctio nam libero tempore cum soluta nobis eligendi optio cumque impedit minus quod maxime placeat".split(" "),
    hipster: "artisan beard ethical fixie flannel kombucha vinyl craft coffee bicycle rights cold-pressed locavore mixtape farm-to-table pour-over twee brunch single-origin mason jar typewriter dreamcatcher hashtag enamel pin retro selvage chambray gentrify squid roof party plaid neutra pinterest yr photo booth cardigan biodiesel fingerstache letterpress meditation thundercats raclette skateboard truffaut tofu salvia hella dreamcatcher migas seitan organic seitan banh mi pug umami pickled tilde echo park hoodie organic gluten-free freegan microdosing".split(" "),
    corporate: "leverage synergy scalable proactive holistic empower disruptive vertical bandwidth ecosystem deliverable strategic actionable insights stakeholder ideation alignment cadence circle back agile sprint roadmap mvp paradigm shift north star pipeline streamline optimize iterate frictionless seamless onboarding rightsize touch base ladder up double down low-hanging fruit move the needle paradigm cross-functional bleeding-edge core competency thought leader value-add throughput white glove pivot drill down value proposition net new key learnings".split(" ")
  };

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function makeSentence(pool, len) {
    var n = len || (4 + Math.floor(Math.random() * 12));
    var words = [];
    for (var i = 0; i < n; i++) words.push(rand(pool));
    words[0] = capitalize(words[0]);
    if (Math.random() < 0.25 && n > 4) words.splice(2 + Math.floor(Math.random() * (n - 4)), 0, words[1] + ",");
    return words.join(" ").replace(/(\w),\s+(\w)/g, "$1, $2") + ".";
  }

  function makeParagraph(pool) {
    var n = 3 + Math.floor(Math.random() * 5);
    var s = [];
    for (var i = 0; i < n; i++) s.push(makeSentence(pool));
    return s.join(" ");
  }

  function init(root) {
    if (!root || root.__loremReady) return;
    root.__loremReady = true;
    var countEl = root.querySelector(".lorem-count");
    var typeEl = root.querySelector(".lorem-type");
    var variantEl = root.querySelector(".lorem-variant");
    var startEl = root.querySelector(".lorem-start");
    var gen = root.querySelector(".lorem-gen");
    var copy = root.querySelector(".lorem-copy");
    var out = root.querySelector(".lorem-output");
    var status = root.querySelector(".lorem-status");

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg || "";
      status.classList.toggle("is-ok", kind === "ok");
    }

    function generate() {
      var pool = POOLS[variantEl.value] || POOLS.classic;
      var count = Math.max(1, Math.min(200, parseInt(countEl.value, 10) || 5));
      var t = typeEl.value;
      var parts = [];
      if (t === "words") {
        for (var i = 0; i < count; i++) parts.push(rand(pool));
        var text = parts.join(" ");
        text = capitalize(text) + ".";
        out.textContent = text;
      } else if (t === "sentences") {
        for (var j = 0; j < count; j++) parts.push(makeSentence(pool));
        out.textContent = parts.join(" ");
      } else {
        for (var k = 0; k < count; k++) parts.push(makeParagraph(pool));
        out.textContent = parts.join("\n\n");
      }
      if (startEl && startEl.checked && variantEl.value === "classic") {
        var current = out.textContent;
        var prefix = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        if (!current.toLowerCase().startsWith("lorem ipsum")) out.textContent = prefix + current;
      }
    }

    if (gen) gen.addEventListener("click", function () { generate(); setStatus(""); });
    if (copy) copy.addEventListener("click", function () {
      if (!out.textContent) { setStatus("Generate first.", null); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(out.textContent).then(function () { setStatus("Copied", "ok"); setTimeout(function () { setStatus(""); }, 1200); });
    });
    generate();
  }
  function boot() { document.querySelectorAll(".lorem-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
