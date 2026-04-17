(function () {

  /* ══════════════════════════════════════
     THEME DEFINITIONS
  ══════════════════════════════════════ */
  var THEMES = [
    "Decision-Making & Thinking",
    "Systems, Technology & Society",
    "Economics, Money & Finance",
    "America, Politics & Culture",
    "Self, Time & Wellbeing",
    "Maintenance, Making & Craft",
    "Kurt Vonnegut",
    "Information & Language"
  ];

  var THEME_COLORS = {
    "Decision-Making & Thinking":     "#2d5a3d",
    "Systems, Technology & Society":  "#1a3a5c",
    "Economics, Money & Finance":     "#7a4010",
    "America, Politics & Culture":    "#6b2d6b",
    "Self, Time & Wellbeing":         "#2d5a5a",
    "Maintenance, Making & Craft":    "#5a4a2d",
    "Kurt Vonnegut":                  "#8b2e2e",
    "Information & Language":         "#3a5a1a"
  };

  var TITLE_TO_THEME = {
    "The Score: How to Stop Playing Somebody Else's Game": "Decision-Making & Thinking",
    "Mental Models:  30 Thinking Tools that Separate the Average From the Exceptional. Improved Decision-Making, Logical Analysis, and Problem-Solving.": "Decision-Making & Thinking",
    "Thinking in Bets: Making Smarter Decisions When You Don't Have All the Facts": "Decision-Making & Thinking",
    "How Magicians Think: Misdirection, Deception, and Why Magic Matters": "Decision-Making & Thinking",
    "Pre-Suasion: A Revolutionary Way to Influence and Persuade": "Decision-Making & Thinking",
    "On Bullshit": "Decision-Making & Thinking",
    "The Family Firm: A Data-Driven Guide to Better Decision Making in the Early School Years (The ParentData Series Book 3)": "Decision-Making & Thinking",
    "The Unaccountability Machine: Why Big Systems Make Terrible Decisions\u2014and How the World Lost Its Mind": "Systems, Technology & Society",
    "The Modem World: A Prehistory of Social Media": "Systems, Technology & Society",
    "Enshittification: Why Everything Suddenly Got Worse and What to Do About It": "Systems, Technology & Society",
    "Survival of the Richest: Escape Fantasies of the Tech Billionaires": "Systems, Technology & Society",
    "Why I (Still) Love Tech: In Defense of a Difficult Industry": "Systems, Technology & Society",
    "The Year in Slop": "Systems, Technology & Society",
    "Stupid TV, Be More Funny: How the Golden Era of The Simpsons Changed Television-and America-Forever": "Systems, Technology & Society",
    "Narrative and Numbers: The Value of Stories in Business (Columbia Business School Publishing)": "Economics, Money & Finance",
    "The Algebra of Wealth: A Simple Formula for Financial Security": "Economics, Money & Finance",
    "Money: The True Story of a Made-Up Thing": "Economics, Money & Finance",
    "The Undercover Economist Strikes Back: How to Run--or Ruin--an Economy": "Economics, Money & Finance",
    "Debt: The First 5,000 Years": "Economics, Money & Finance",
    "Payoff: The Hidden Logic That Shapes Our Motivations (TED Books)": "Economics, Money & Finance",
    "Speculative Communities: Living with Uncertainty in a Financialized World": "Economics, Money & Finance",
    "Exxon: The Road Not Taken (Kindle Single)": "Economics, Money & Finance",
    "The End of Money: Counterfeiters, Preachers, Techies, Dreamers--and the Coming Cashless Society": "Economics, Money & Finance",
    "The Aftermath: The Last Days of the Baby Boom and the Future of Power in America": "America, Politics & Culture",
    "Adrift: America in 100 Charts": "America, Politics & Culture",
    "The Nineties: A Book": "America, Politics & Culture",
    "Ringmaster: Vince McMahon and the Unmaking of America": "America, Politics & Culture",
    "Romney: A Reckoning": "America, Politics & Culture",
    "Excellent Advice for Living: Wisdom I Wish I'd Known Earlier": "Self, Time & Wellbeing",
    "Your Future Self: How to Make Tomorrow Better Today": "Self, Time & Wellbeing",
    "Four Thousand Weeks: Time Management for Mortals": "Self, Time & Wellbeing",
    "The Algebra of Happiness: Notes on the Pursuit of Success, Love, and Meaning": "Self, Time & Wellbeing",
    "The Heart of Caring: A Life in Pediatrics": "Self, Time & Wellbeing",
    "When Breath Becomes Air": "Self, Time & Wellbeing",
    "Maintenance of Everything: Part One (Maintenance: Of Everything Book 1)": "Maintenance, Making & Craft",
    "Cat's Cradle: A Novel": "Kurt Vonnegut",
    "Timequake": "Kurt Vonnegut",
    "Slapstick": "Kurt Vonnegut",
    "Hocus Pocus": "Kurt Vonnegut",
    "Mother Night: A Novel": "Kurt Vonnegut",
    "Slaughterhouse-Five: A Novel (Modern Library 100 Best Novels)": "Kurt Vonnegut",
    "So the Wind Won't Blow It All Away": "Kurt Vonnegut",
    "The Science of First: Catching Early Signals Before They Become News": "Information & Language",
    "The Secret Life of Pronouns: What Our Words Say About Us": "Information & Language",
    "The Night the Lights Went Out: A Memoir of Life After Brain Damage": "Information & Language"
  };

  function assignTheme(title) {
    if (TITLE_TO_THEME[title]) return TITLE_TO_THEME[title];
    // fuzzy: check if any known title is contained
    for (var t in TITLE_TO_THEME) {
      if (title.indexOf(t.slice(0, 20)) !== -1) return TITLE_TO_THEME[t];
    }
    return "Other";
  }

  /* ══════════════════════════════════════
     STATE
  ══════════════════════════════════════ */
  var HIGHLIGHTS = [];
  var S = {
    phase: 'token',   // token | loading | dashboard
    tab: 'highlights',
    view: 'grouped',
    search: '', book: null, theme: null, author: null,
    sel: null, ri: null
  };
  var openDD = null;

  /* ══════════════════════════════════════
     UTILS
  ══════════════════════════════════════ */
  function esc(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fdate(d) {
    if (!d) return '';
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch (e) { return d; }
  }
  function setLoadingMsg(msg) {
    var el = document.getElementById('loading-msg');
    if (el) el.textContent = msg;
  }
  function showPhase(phase) {
    S.phase = phase;
    document.getElementById('token-screen').style.display  = phase === 'token'   ? 'flex'  : 'none';
    document.getElementById('loading-screen').style.display = phase === 'loading' ? 'flex'  : 'none';
    document.getElementById('app').style.display            = phase === 'dashboard' ? 'flex' : 'none';
  }

  /* ══════════════════════════════════════
     API (via Netlify proxy)
  ══════════════════════════════════════ */
  var TOKEN = '';

  async function rwFetch(endpoint, page) {
    var url = '/.netlify/functions/readwise?endpoint=' + endpoint + '&page=' + (page || 1);
    var res;
    try {
      res = await fetch(url, { headers: { 'x-readwise-token': TOKEN } });
    } catch (e) {
      throw new Error('Network error — could not reach the server. Are you online? (' + e.message + ')');
    }
    var text = await res.text();
    if (!res.ok) {
      var detail = '';
      try { detail = JSON.parse(text).error || text; } catch (_) { detail = text; }
      if (res.status === 401) throw new Error('Invalid token — check readwise.io/access_token and try again.');
      if (res.status === 404) throw new Error('Function not found (404) — make sure the site is deployed on Netlify, not opened as a local file.');
      throw new Error('API error ' + res.status + ': ' + detail);
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error('Unexpected response from server: ' + text.slice(0, 120));
    }
  }

  async function fetchAll(endpoint, onProgress) {
    var results = [], page = 1;
    while (true) {
      var data = await rwFetch(endpoint, page);
      results = results.concat(data.results || []);
      if (onProgress) onProgress(results.length);
      if (!data.next) break;
      page++;
    }
    return results;
  }

  /* ══════════════════════════════════════
     CONNECT / LOAD
  ══════════════════════════════════════ */
  async function connect() {
    var inp = document.getElementById('token-input');
    var token = inp ? inp.value.trim() : '';
    if (!token) { showTokenError('Please paste your Readwise access token.'); return; }
    TOKEN = token;
    document.getElementById('token-error').innerHTML = '';
    document.getElementById('connect-btn').disabled = true;
    document.getElementById('connect-btn').textContent = 'Connecting…';
    try {
      await rwFetch('highlights', 1); // auth check
      localStorage.setItem('rw_token', token);
      await loadData();
    } catch (e) {
      TOKEN = '';
      document.getElementById('connect-btn').disabled = false;
      document.getElementById('connect-btn').textContent = 'Connect';
      showTokenError(e.message);
    }
  }

  function showTokenError(msg) {
    document.getElementById('token-error').innerHTML =
      '<div class="error-box">' + esc(msg) + '</div>';
  }

  async function loadData() {
    showPhase('loading');
    try {
      setLoadingMsg('Fetching highlights…');
      var rawHL = await fetchAll('highlights', function (n) {
        setLoadingMsg('Loaded ' + n + ' highlights…');
      });
      setLoadingMsg('Fetching books…');
      var rawBooks = await fetchAll('books');

      // Build book lookup
      var bookMap = {};
      rawBooks.forEach(function (b) { bookMap[b.id] = b; });

      // Assemble highlights
      HIGHLIGHTS = rawHL.map(function (h, i) {
        var book = bookMap[h.book_id] || {};
        var title = (book.title || 'Unknown').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
        var author = (book.author || '').replace(/&#39;/g, "'");
        return {
          id: i,
          text: h.text || '',
          title: title,
          author: author,
          note: h.note || '',
          color: h.color || '',
          date: (h.highlighted_at || h.updated || '').slice(0, 10),
          theme: assignTheme(title)
        };
      });

      showPhase('dashboard');
      render();
    } catch (e) {
      showPhase('token');
      showTokenError(e.message);
    }
  }

  function disconnect() {
    localStorage.removeItem('rw_token');
    TOKEN = '';
    HIGHLIGHTS = [];
    S.tab = 'highlights'; S.view = 'grouped';
    S.search = ''; S.book = null; S.theme = null; S.author = null;
    S.sel = null; S.ri = null;
    document.getElementById('token-input').value = '';
    showPhase('token');
  }

  /* ══════════════════════════════════════
     FILTERING
  ══════════════════════════════════════ */
  function filtered() {
    var h = HIGHLIGHTS;
    if (S.search) {
      var q = S.search.toLowerCase();
      h = h.filter(function (x) {
        return (x.text || '').toLowerCase().indexOf(q) !== -1
          || (x.title || '').toLowerCase().indexOf(q) !== -1
          || (x.author || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    if (S.theme)  h = h.filter(function (x) { return x.theme === S.theme; });
    if (S.book)   h = h.filter(function (x) { return x.title === S.book; });
    if (S.author) h = h.filter(function (x) { return x.author === S.author; });
    return h;
  }

  /* ══════════════════════════════════════
     CONNECTIONS
  ══════════════════════════════════════ */
  function connections(h) {
    var words = new Set(
      (h.text || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(' ')
        .filter(function (w) { return w.length > 5; })
    );
    return HIGHLIGHTS
      .filter(function (x) { return x.id !== h.id; })
      .map(function (x) {
        var score = (x.text || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(' ')
          .filter(function (w) { return w.length > 5 && words.has(w); }).length;
        return { h: x, score: score };
      })
      .filter(function (x) { return x.score >= 2; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 8);
  }

  /* ══════════════════════════════════════
     DROPDOWNS
  ══════════════════════════════════════ */
  function closeAllDDs() {
    document.querySelectorAll('.dd-menu').forEach(function (m) { m.classList.remove('open'); });
    openDD = null;
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dd-wrap')) closeAllDDs();
  });
  function toggleDD(name) {
    var menu = document.getElementById(name + '-dd-menu');
    if (!menu) return;
    var wasOpen = menu.classList.contains('open');
    closeAllDDs();
    if (!wasOpen) {
      menu.classList.add('open'); openDD = name;
      var si = document.getElementById(name + '-dd-search');
      if (si) { si.value = ''; filterDDOptions(name, ''); si.focus(); }
    }
  }
  function filterDDOptions(name, q) {
    var c = document.getElementById(name + '-dd-options'); if (!c) return;
    q = q.toLowerCase();
    c.querySelectorAll('.dd-option').forEach(function (o) {
      o.style.display = (!q || (o.dataset.label || '').toLowerCase().indexOf(q) !== -1) ? '' : 'none';
    });
  }

  /* ══════════════════════════════════════
     SIDEBAR
  ══════════════════════════════════════ */
  function buildSidebar(f) {
    document.getElementById('badge').textContent = f.length.toLocaleString() + ' highlights';
    var tcounts = {};
    HIGHLIGHTS.forEach(function (h) { tcounts[h.theme] = (tcounts[h.theme] || 0) + 1; });
    document.getElementById('theme-sidebar').innerHTML = THEMES.map(function (t) {
      var on = S.theme === t, color = THEME_COLORS[t] || '#666';
      return '<div class="sb-item' + (on ? ' on' : '') + '" data-theme="' + esc(t) + '"'
        + (on ? ' style="background:' + color + '18;color:' + color + ';"' : '') + '>'
        + '<span class="sb-dot" style="background:' + color + '"></span>'
        + '<span class="sb-name">' + esc(t) + '</span>'
        + '<span class="sb-n"' + (on ? ' style="background:' + color + ';color:#fff"' : '') + '>' + (tcounts[t] || 0) + '</span></div>';
    }).join('');
    var acounts = {};
    HIGHLIGHTS.forEach(function (h) { if (h.author) acounts[h.author] = (acounts[h.author] || 0) + 1; });
    var as = Object.entries(acounts).sort(function (a, b) { return b[1] - a[1]; });
    document.getElementById('author-sidebar').innerHTML = as.map(function (a) {
      return '<div class="sb-item' + (S.author === a[0] ? ' on' : '') + '" data-author="' + esc(a[0]) + '">'
        + '<span class="sb-name">' + esc(a[0]) + '</span>'
        + '<span class="sb-n">' + a[1] + '</span></div>';
    }).join('');
  }

  /* ══════════════════════════════════════
     BOOK DROPDOWN
  ══════════════════════════════════════ */
  function buildBookDD() {
    var books = {};
    HIGHLIGHTS.forEach(function (h) {
      if (!books[h.title]) books[h.title] = { author: h.author, theme: h.theme, count: 0 };
      books[h.title].count++;
    });
    var byTheme = {};
    Object.entries(books).forEach(function (e) {
      var t = e[1].theme || 'Other';
      if (!byTheme[t]) byTheme[t] = [];
      byTheme[t].push({ title: e[0], author: e[1].author, count: e[1].count });
    });
    var html = '';
    THEMES.forEach(function (theme) {
      var group = byTheme[theme]; if (!group || !group.length) return;
      group.sort(function (a, b) { return b.count - a.count; });
      html += '<div class="dd-section-label">' + esc(theme) + '</div>';
      group.forEach(function (b) {
        var short = b.title.length > 50 ? b.title.slice(0, 48) + '…' : b.title;
        html += '<div class="dd-option' + (S.book === b.title ? ' selected' : '') + '" data-label="' + esc(b.title) + '" data-book="' + esc(b.title) + '">'
          + '<span class="dd-opt-name" title="' + esc(b.title) + '">' + esc(short) + '</span>'
          + '<span class="dd-opt-n">' + b.count + '</span></div>';
      });
      html += '<div class="dd-divider"></div>';
    });
    // Other
    if (byTheme['Other']) {
      html += '<div class="dd-section-label">Other</div>';
      byTheme['Other'].forEach(function (b) {
        html += '<div class="dd-option' + (S.book === b.title ? ' selected' : '') + '" data-label="' + esc(b.title) + '" data-book="' + esc(b.title) + '">'
          + '<span class="dd-opt-name">' + esc(b.title.slice(0, 50)) + '</span>'
          + '<span class="dd-opt-n">' + b.count + '</span></div>';
      });
    }
    document.getElementById('book-dd-options').innerHTML = html;
    var lbl = S.book ? (S.book.length > 32 ? S.book.slice(0, 30) + '…' : S.book) : 'All books';
    document.getElementById('book-dd-label').textContent = lbl;
    document.getElementById('book-dd-btn').classList.toggle('active', !!S.book);
  }

  /* ══════════════════════════════════════
     THEME DROPDOWN
  ══════════════════════════════════════ */
  function buildThemeDD() {
    var counts = {};
    HIGHLIGHTS.forEach(function (h) { counts[h.theme] = (counts[h.theme] || 0) + 1; });
    document.getElementById('theme-dd-options').innerHTML = THEMES.map(function (t) {
      return '<div class="dd-option' + (S.theme === t ? ' selected' : '') + '" data-label="' + esc(t) + '" data-theme="' + esc(t) + '">'
        + '<span class="dd-opt-name">' + esc(t) + '</span>'
        + '<span class="dd-opt-n">' + (counts[t] || 0) + '</span></div>';
    }).join('');
    var lbl = S.theme ? (S.theme.length > 22 ? S.theme.slice(0, 20) + '…' : S.theme) : 'All themes';
    document.getElementById('theme-dd-label').textContent = lbl;
    document.getElementById('theme-dd-btn').classList.toggle('active', !!S.theme);
  }

  /* ══════════════════════════════════════
     FILTER BAR
  ══════════════════════════════════════ */
  function renderFilterBar() {
    var chips = '';
    if (S.theme)  chips += '<div class="fchip" data-clear="theme" style="background:' + THEME_COLORS[S.theme] + '18;color:' + THEME_COLORS[S.theme] + ';">Theme: ' + esc(S.theme) + ' <span>✕</span></div>';
    if (S.book)   chips += '<div class="fchip" data-clear="book">Book: ' + esc(S.book.slice(0, 40)) + (S.book.length > 40 ? '…' : '') + ' <span>✕</span></div>';
    if (S.author) chips += '<div class="fchip" data-clear="author">Author: ' + esc(S.author) + ' <span>✕</span></div>';
    if (S.search) chips += '<div class="fchip" data-clear="search">Search: &ldquo;' + esc(S.search) + '&rdquo; <span>✕</span></div>';
    return chips ? '<div class="filter-bar">' + chips + '</div>' : '';
  }

  /* ══════════════════════════════════════
     HIGHLIGHT CARD
  ══════════════════════════════════════ */
  function hlCard(h, showBook) {
    return '<div class="hl">'
      + (showBook ? '<div class="hl-bk">' + esc(h.title) + (h.author ? ' &middot; ' + esc(h.author) : '') + '</div>' : '')
      + '<div class="hl-text">' + esc(h.text || '') + '</div>'
      + (h.note ? '<div class="hl-note">' + esc(h.note) + '</div>' : '')
      + '<div class="hl-meta">' + (h.color ? '<span class="hl-dot col-' + esc(h.color) + '"></span>' : '')
      + '<span class="hl-date">' + fdate(h.date) + '</span></div></div>';
  }

  /* ══════════════════════════════════════
     GROUPED VIEW
  ══════════════════════════════════════ */
  function renderGrouped(h) {
    if (!h.length) return '<div class="empty">No highlights match.</div>';
    var groups = {}, order = [];
    h.forEach(function (x) {
      if (!groups[x.title]) { groups[x.title] = []; order.push(x.title); }
      groups[x.title].push(x);
    });
    if (S.ri === null || S.ri >= h.length) S.ri = Math.floor(Math.random() * h.length);
    var rh = h[S.ri];
    var rcolor = THEME_COLORS[rh.theme] || '#2d5a3d';
    var top = '<div class="random-card" style="border-left:3px solid ' + rcolor + '">'
      + '<div class="random-body">'
      + '<div class="random-theme" style="color:' + rcolor + '">' + esc(rh.theme) + '</div>'
      + '<div class="rq">' + esc((rh.text || '').slice(0, 260)) + ((rh.text || '').length > 260 ? '…' : '') + '</div>'
      + '<div class="rs">' + esc(rh.author) + ' — ' + esc(rh.title.slice(0, 60)) + '</div>'
      + '</div><button class="btn-sm" id="random-btn">&#8635; Random</button></div>';
    return top + order.map(function (title) {
      var hls = groups[title], color = THEME_COLORS[hls[0].theme] || '#ccc';
      return '<div class="grp">'
        + '<div class="grp-hdr">'
        + '<span class="grp-color-dot" style="background:' + color + '"></span>'
        + '<span class="grp-title">' + esc(title) + '</span>'
        + '<span class="grp-author">' + esc(hls[0].author) + '</span>'
        + '<span class="grp-n">' + hls.length + '</span>'
        + '<span class="chev">▾</span></div>'
        + '<div class="grp-body">' + hls.map(function (x) { return hlCard(x, false); }).join('') + '</div>'
        + '</div>';
    }).join('');
  }

  /* ══════════════════════════════════════
     FLAT VIEW
  ══════════════════════════════════════ */
  function renderFlat(h) {
    if (!h.length) return '<div class="empty">No highlights match.</div>';
    return '<div class="flat-wrap">' + h.map(function (x) { return hlCard(x, true); }).join('') + '</div>';
  }

  /* ══════════════════════════════════════
     CONNECTIONS VIEW
  ══════════════════════════════════════ */
  function renderConn(h) {
    if (!S.sel) {
      return '<div class="conn-intro"><h3>Connections Explorer</h3>'
        + '<p>Click any highlight — Claude will find conceptual connections across your library, not just shared words.</p></div>'
        + h.slice(0, 60).map(function (x) {
          return '<div class="grp conn-pick" data-sel="' + x.id + '">'
            + '<div class="grp-hdr"><span class="grp-title">' + esc(x.title) + '</span><span class="grp-author">' + esc(x.author) + '</span></div>'
            + '<div class="grp-body"><div class="hl"><div class="hl-text">' + esc((x.text || '').slice(0, 200)) + ((x.text || '').length > 200 ? '…' : '') + '</div></div></div>'
            + '</div>';
        }).join('');
    }
    var sel = HIGHLIGHTS.find(function (x) { return x.id === S.sel; });
    if (!sel) return '';

    // Show loading state, then async load Claude connections
    var color = THEME_COLORS[sel.theme] || '#2d5a3d';
    var html = '<div class="back" id="conn-back">← Back</div>'
      + '<div class="conn-sel">'
      + '<div class="conn-lbl">Selected highlight</div>'
      + '<div class="conn-src">' + esc(sel.title) + ' &middot; ' + esc(sel.author) + '</div>'
      + '<div class="conn-qt">' + esc(sel.text || '') + '</div>'
      + '</div>'
      + '<div class="results-box">'
      + '<div class="results-hdr" id="conn-results-hdr">Finding connections with Claude…</div>'
      + '<div id="conn-results-body"><div class="conn-loading"><div class="conn-spinner"></div><span>Analyzing your library…</span></div></div>'
      + '</div>';

    // Async: fetch Claude connections then update DOM
    claudeConnections(sel).then(function(results) {
      var hdrEl = document.getElementById("conn-results-hdr");
      var bodyEl = document.getElementById("conn-results-body");
      if (!hdrEl || !bodyEl) return;

      if (!results || results.length === 0) {
        // fallback to word matching
        var fallback = connections(sel);
        hdrEl.textContent = "Related highlights (" + fallback.length + ")";
        bodyEl.innerHTML = fallback.length === 0
          ? "<div class='empty-sm'>No strong matches found.</div>"
          : fallback.map(function(c) {
              var col = THEME_COLORS[c.h.theme] || "#ccc";
              return "<div class='rel-item'><span class='rel-score'>" + c.score + " shared</span>"
                + "<div class='rel-body'><div class='rel-text'>" + esc((c.h.text||"").slice(0,200)) + "</div>"
                + "<div class='rel-src'><span class='rel-theme-dot' style='background:" + col + "'></span>" + esc(c.h.title) + " &middot; " + esc(c.h.author) + "</div></div></div>";
            }).join("");
        return;
      }

      hdrEl.textContent = "Claude found " + results.length + " conceptual connections";
      bodyEl.innerHTML = results.map(function(r) {
        var col = THEME_COLORS[r.h.theme] || "#ccc";
        return "<div class='rel-item claude-conn'>"
          + "<div class='rel-body'>"
          + "<div class='conn-reason'>" + esc(r.connection) + "</div>"
          + "<div class='rel-text'>" + esc((r.h.text||"").slice(0,200)) + ((r.h.text||"").length>200?"…":"") + "</div>"
          + "<div class='rel-src'><span class='rel-theme-dot' style='background:" + col + "'></span>" + esc(r.h.title) + " &middot; " + esc(r.h.author) + "</div>"
          + "</div></div>";
      }).join("");
    });

    return html;
  }

  /* ══════════════════════════════════════
     NETWORK GRAPH
  ══════════════════════════════════════ */
  var NET = { canvas: null, ctx: null, width: 0, height: 0, animFrame: null, hover: null, dragging: null, dragOffX: 0, dragOffY: 0 };

  function buildNetworkData() {
    var STOPWORDS = new Set('the and for are but not you all can had her was one our out did get has him his how its may now off only say she too use via who yet your from that this with they been have into more also when where what were about after before some than them then their there these those such much many most used just like will even well said each made both time back over'.split(' '));
    var wordToThemes = {};
    HIGHLIGHTS.forEach(function (h) {
      var words = new Set((h.text || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(' ').filter(function (w) { return w.length > 5 && !STOPWORDS.has(w); }));
      words.forEach(function (w) { if (!wordToThemes[w]) wordToThemes[w] = []; wordToThemes[w].push(h.theme); });
    });
    var linkMap = {};
    Object.values(wordToThemes).forEach(function (themes) {
      if (themes.length < 2 || themes.length > 50) return;
      for (var i = 0; i < themes.length; i++) {
        for (var j = i + 1; j < themes.length; j++) {
          if (themes[i] === themes[j]) continue;
          var key = themes[i] < themes[j] ? themes[i] + '|||' + themes[j] : themes[j] + '|||' + themes[i];
          linkMap[key] = (linkMap[key] || 0) + 1;
        }
      }
    });
    var counts = {};
    HIGHLIGHTS.forEach(function (h) { counts[h.theme] = (counts[h.theme] || 0) + 1; });
    return {
      nodes: THEMES.map(function (t) { return { id: t, count: counts[t] || 0, color: THEME_COLORS[t], x: 0, y: 0, vx: 0, vy: 0 }; }),
      links: Object.entries(linkMap).map(function (e) {
        var p = e[0].split('|||');
        return { source: p[0], target: p[1], value: e[1] };
      })
    };
  }

  function renderNetwork() {
    var mc = document.getElementById('main');
    mc.innerHTML = '<div id="net-wrap">'
      + '<div id="net-header">'
      + '<div id="net-legend"></div>'
      + '<div id="net-info"><div id="net-info-inner"><p>Circles = themes, sized by highlight count.<br>Lines = shared vocabulary between themes.<br>Thicker = stronger connection.<br><strong>Hover</strong> to inspect &middot; <strong>Drag</strong> to rearrange.</p></div></div>'
      + '</div>'
      + '<canvas id="net-canvas"></canvas>'
      + '</div>';

    document.getElementById('net-legend').innerHTML = THEMES.map(function (t) {
      return '<div class="net-leg-item"><span class="net-leg-dot" style="background:' + THEME_COLORS[t] + '"></span><span>' + esc(t) + '</span></div>';
    }).join('');

    var data = buildNetworkData();
    var nodes = data.nodes, links = data.links;
    var nodeMap = {};
    nodes.forEach(function (n) { nodeMap[n.id] = n; });
    links.forEach(function (l) { l.s = nodeMap[l.source]; l.t = nodeMap[l.target]; });
    var maxVal = Math.max.apply(null, links.map(function (l) { return l.value; }));
    links.forEach(function (l) { l.norm = l.value / maxVal; });

    var canvas = document.getElementById('net-canvas');
    NET.canvas = canvas; NET.ctx = canvas.getContext('2d');

    function resize() {
      var wrap = document.getElementById('net-wrap'); if (!wrap) return;
      NET.width = wrap.clientWidth;
      NET.height = Math.max(480, window.innerHeight - 220);
      canvas.width = NET.width * window.devicePixelRatio;
      canvas.height = NET.height * window.devicePixelRatio;
      canvas.style.width = NET.width + 'px';
      canvas.style.height = NET.height + 'px';
      NET.ctx.setTransform(1, 0, 0, 1, 0, 0);
      NET.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', function () { resize(); drawNet(); });

    var cx = NET.width / 2, cy = NET.height / 2, r = Math.min(NET.width, NET.height) * 0.32;
    nodes.forEach(function (n, i) {
      var angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      n.x = cx + Math.cos(angle) * r; n.y = cy + Math.sin(angle) * r;
    });

    function nodeRadius(n) { return Math.max(28, Math.min(62, 18 + n.count * 0.05)); }

    function tick() {
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var force = 18000 / (dist * dist);
          var fx = dx / dist * force * 0.08, fy = dy / dist * force * 0.08;
          nodes[i].vx -= fx; nodes[i].vy -= fy;
          nodes[j].vx += fx; nodes[j].vy += fy;
        }
      }
      links.forEach(function (l) {
        if (!l.s || !l.t) return;
        var dx = l.t.x - l.s.x, dy = l.t.y - l.s.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var target = 180 + l.norm * 40;
        var force = (dist - target) * 0.03 * l.norm;
        var fx = dx / dist * force, fy = dy / dist * force;
        l.s.vx += fx; l.s.vy += fy;
        l.t.vx -= fx; l.t.vy -= fy;
      });
      var cx2 = NET.width / 2, cy2 = NET.height / 2;
      nodes.forEach(function (n) {
        n.vx += (cx2 - n.x) * 0.008; n.vy += (cy2 - n.y) * 0.008;
      });
      nodes.forEach(function (n) {
        if (n === NET.dragging) return;
        n.vx *= 0.82; n.vy *= 0.82;
        n.x += n.vx; n.y += n.vy;
        var pad = nodeRadius(n) + 8;
        n.x = Math.max(pad, Math.min(NET.width - pad, n.x));
        n.y = Math.max(pad, Math.min(NET.height - pad, n.y));
      });
      drawNet();
    }

    function drawNet() {
      var ctx = NET.ctx, W = NET.width, H = NET.height;
      ctx.clearRect(0, 0, W, H);
      links.forEach(function (l) {
        if (!l.s || !l.t) return;
        var isHov = NET.hover && (NET.hover.id === l.source || NET.hover.id === l.target);
        ctx.beginPath(); ctx.moveTo(l.s.x, l.s.y); ctx.lineTo(l.t.x, l.t.y);
        ctx.strokeStyle = isHov ? l.s.color : '#b0a898';
        ctx.globalAlpha = isHov ? 0.85 : 0.18 + l.norm * 0.35;
        ctx.lineWidth = isHov ? 2 + l.norm * 8 : 0.5 + l.norm * 4;
        ctx.stroke(); ctx.globalAlpha = 1;
      });
      if (NET.hover) {
        links.forEach(function (l) {
          if (!l.s || !l.t || (l.source !== NET.hover.id && l.target !== NET.hover.id)) return;
          var mx = (l.s.x + l.t.x) / 2, my = (l.s.y + l.t.y) / 2;
          ctx.font = 'bold 11px DM Sans, sans-serif'; ctx.fillStyle = '#7a7568';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(Math.round(l.norm * 100) + '%', mx, my);
        });
      }
      nodes.forEach(function (n) {
        var r = nodeRadius(n), isHov = NET.hover && NET.hover.id === n.id;
        var isDim = NET.hover && !isHov;
        if (isDim) {
          var connected = links.some(function (l) { return (l.source === n.id && l.target === NET.hover.id) || (l.target === n.id && l.source === NET.hover.id); });
          if (connected) isDim = false;
        }
        ctx.globalAlpha = isDim ? 0.3 : 1;
        if (isHov) { ctx.shadowColor = n.color; ctx.shadowBlur = 18; }
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '22'; ctx.fill();
        ctx.strokeStyle = n.color; ctx.lineWidth = isHov ? 2.5 : 1.5; ctx.stroke();
        ctx.shadowBlur = 0;
        var shortLabel = n.id.replace(' & ', ' &\n').replace('Making &\n', 'Making & ');
        var lines = shortLabel.split('\n');
        ctx.fillStyle = n.color;
        ctx.font = (isHov ? '500 ' : '') + '12px DM Sans, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var lineH = 15;
        lines.forEach(function (line, i) { ctx.fillText(line, n.x, n.y + (i - (lines.length - 1) / 2) * lineH); });
        ctx.font = '11px DM Sans, sans-serif'; ctx.fillStyle = n.color + '99';
        ctx.fillText(n.count, n.x, n.y + r + 14);
        ctx.globalAlpha = 1;
      });
    }

    function getNodeAt(x, y) {
      for (var i = nodes.length - 1; i >= 0; i--) {
        var n = nodes[i], r = nodeRadius(n), dx = x - n.x, dy = y - n.y;
        if (dx * dx + dy * dy <= r * r) return n;
      }
      return null;
    }
    function getXY(e) {
      var rect = canvas.getBoundingClientRect(), touch = e.touches ? e.touches[0] : e;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    canvas.addEventListener('mousemove', function (e) {
      var p = getXY(e);
      if (NET.dragging) { NET.dragging.x = p.x + NET.dragOffX; NET.dragging.y = p.y + NET.dragOffY; NET.dragging.vx = 0; NET.dragging.vy = 0; drawNet(); return; }
      var node = getNodeAt(p.x, p.y);
      if (node !== NET.hover) { NET.hover = node; canvas.style.cursor = node ? 'grab' : 'default'; drawNet(); }
      var info = document.getElementById('net-info-inner');
      if (node && info) {
        var connLinks = links.filter(function (l) { return l.source === node.id || l.target === node.id; }).sort(function (a, b) { return b.value - a.value; });
        info.innerHTML = '<div class="net-info-title" style="color:' + node.color + '">' + esc(node.id) + '</div>'
          + '<div class="net-info-count">' + node.count + ' highlights</div>'
          + '<div class="net-info-sub">Strongest connections:</div>'
          + connLinks.slice(0, 5).map(function (l) {
              var other = l.source === node.id ? l.target : l.source;
              return '<div class="net-info-link"><span class="net-leg-dot" style="background:' + (THEME_COLORS[other] || '#666') + '"></span><span>' + esc(other) + '</span><span class="net-info-pct">' + Math.round(l.norm * 100) + '%</span></div>';
            }).join('');
      } else if (info) {
        info.innerHTML = '<p>Circles = themes, sized by highlight count.<br>Lines = shared vocabulary.<br><strong>Hover</strong> to inspect &middot; <strong>Drag</strong> to rearrange.</p>';
      }
    });
    canvas.addEventListener('mousedown', function (e) {
      var p = getXY(e), node = getNodeAt(p.x, p.y);
      if (node) { NET.dragging = node; NET.dragOffX = node.x - p.x; NET.dragOffY = node.y - p.y; canvas.style.cursor = 'grabbing'; }
    });
    canvas.addEventListener('mouseup', function () { NET.dragging = null; canvas.style.cursor = NET.hover ? 'grab' : 'default'; });
    canvas.addEventListener('mouseleave', function () { NET.dragging = null; NET.hover = null; drawNet(); });

    var ticks = 0;
    function loop() { if (ticks < 300) { tick(); ticks++; } else drawNet(); NET.animFrame = requestAnimationFrame(loop); }
    if (NET.animFrame) cancelAnimationFrame(NET.animFrame);
    loop();
  }

  /* ══════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════ */
  function render() {
    var f = filtered();
    buildSidebar(f);
    buildBookDD();
    buildThemeDD();

    document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === S.tab); });
    var hlc = document.getElementById('hl-controls');
    if (hlc) hlc.style.display = S.tab === 'highlights' ? 'contents' : 'none';

    if (S.tab === 'network') {
      if (NET.animFrame) cancelAnimationFrame(NET.animFrame);
      renderNetwork(); return;
    }
    if (S.tab === 'map') {
      if (NET.animFrame) { cancelAnimationFrame(NET.animFrame); NET.animFrame = null; }
      renderIdeaMap(); return;
    }
    if (NET.animFrame) { cancelAnimationFrame(NET.animFrame); NET.animFrame = null; }

    var mc = document.getElementById('main');
    var body = S.view === 'conn' ? renderConn(f) : S.view === 'flat' ? renderFlat(f) : renderGrouped(f);
    mc.innerHTML = renderFilterBar() + body;
  }

  /* ══════════════════════════════════════
     EVENT DELEGATION
  ══════════════════════════════════════ */
  document.addEventListener('click', function (e) {
    if (e.target.id === 'connect-btn') { connect(); return; }
    if (e.target.id === 'disconnect-btn') { disconnect(); return; }
    if (e.target.id === 'conn-back') { S.sel = null; render(); return; }
    if (e.target.id === 'random-btn') { S.ri = Math.floor(Math.random() * filtered().length); render(); return; }

    var tb = e.target.closest('.tab-btn');
    if (tb) { S.tab = tb.dataset.tab; S.sel = null; if (NET.animFrame && S.tab !== 'network') { cancelAnimationFrame(NET.animFrame); NET.animFrame = null; } render(); return; }

    var vb = e.target.closest('.vbtns button');
    if (vb) { setView(vb.dataset.view); return; }

    var chip = e.target.closest('.fchip');
    if (chip && e.target.tagName === 'SPAN') {
      var w = chip.dataset.clear;
      if (w === 'theme') S.theme = null;
      if (w === 'book') S.book = null;
      if (w === 'author') S.author = null;
      if (w === 'search') { S.search = ''; document.getElementById('search').value = ''; }
      S.ri = null; render(); return;
    }

    var bOpt = e.target.closest('#book-dd-options .dd-option');
    if (bOpt) { var bv = bOpt.dataset.book; S.book = (S.book === bv) ? null : bv; S.author = null; S.theme = null; S.ri = null; closeAllDDs(); render(); return; }

    var tOpt = e.target.closest('#theme-dd-options .dd-option');
    if (tOpt) { var tv = tOpt.dataset.theme; S.theme = (S.theme === tv) ? null : tv; S.book = null; S.ri = null; closeAllDDs(); render(); return; }

    if (e.target.closest('.dd-clear')) {
      var dw = e.target.closest('.dd-wrap');
      if (dw && dw.id === 'book-dd-wrap') { S.book = null; S.ri = null; closeAllDDs(); render(); return; }
      if (dw && dw.id === 'theme-dd-wrap') { S.theme = null; S.ri = null; closeAllDDs(); render(); return; }
    }

    var ddBtn = e.target.closest('.dd-btn');
    if (ddBtn) { var dw2 = ddBtn.closest('.dd-wrap'); if (dw2) toggleDD(dw2.id.replace('-dd-wrap', '')); return; }

    var sbt = e.target.closest('#theme-sidebar .sb-item');
    if (sbt) { var t2 = sbt.dataset.theme; S.theme = (S.theme === t2) ? null : t2; S.book = null; S.ri = null; render(); return; }

    var sba = e.target.closest('#author-sidebar .sb-item');
    if (sba) { var a2 = sba.dataset.author; S.author = (S.author === a2) ? null : a2; S.book = null; S.ri = null; render(); return; }

    var gh = e.target.closest('.grp-hdr');
    if (gh && !e.target.closest('.conn-pick')) { gh.closest('.grp').classList.toggle('closed'); return; }

    var cp = e.target.closest('.conn-pick');
    if (cp) { S.sel = parseInt(cp.dataset.sel, 10); render(); return; }
  });

  document.getElementById('token-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') connect(); });
  document.getElementById('search').addEventListener('input', function () { S.search = this.value; S.ri = null; render(); });
  document.getElementById('book-dd-search').addEventListener('input', function () { filterDDOptions('book', this.value); });

  function setView(v) {
    S.view = v; S.sel = null;
    document.querySelectorAll('.vbtns button').forEach(function (b) { b.classList.toggle('on', b.dataset.view === v); });
    render();
  }

  /* ══════════════════════════════════════
     BOOT
  ══════════════════════════════════════ */
  var saved = localStorage.getItem('rw_token');
  if (saved) { TOKEN = saved; loadData(); }
  else showPhase('token');

  /* ══════════════════════════════════════
     CLAUDE-POWERED CONNECTIONS (#3)
  ══════════════════════════════════════ */

  var connCache = {}; // cache by highlight id

  async function claudeConnections(h) {
    if (connCache[h.id]) return connCache[h.id];

    // Build candidate pool: pick highlights from OTHER themes, diverse books
    var others = HIGHLIGHTS.filter(function(x) {
      return x.id !== h.id && x.theme !== h.theme;
    });
    // Shuffle and take 40 candidates spread across themes
    var byTheme = {};
    others.forEach(function(x) {
      if (!byTheme[x.theme]) byTheme[x.theme] = [];
      byTheme[x.theme].push(x);
    });
    var candidates = [];
    Object.values(byTheme).forEach(function(group) {
      // shuffle group
      for (var i = group.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = group[i]; group[i] = group[j]; group[j] = tmp;
      }
      candidates = candidates.concat(group.slice(0, 7));
    });
    // Also add some from same theme for richer results
    var sameTheme = HIGHLIGHTS.filter(function(x) { return x.id !== h.id && x.theme === h.theme; });
    for (var i = sameTheme.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = sameTheme[i]; sameTheme[i] = sameTheme[j]; sameTheme[j] = tmp;
    }
    candidates = candidates.concat(sameTheme.slice(0, 8));

    var candidateList = candidates.map(function(c, i) {
      return i + ': [' + c.title.slice(0, 40) + '] ' + c.text.slice(0, 120);
    }).join('\n');

    var prompt = 'You are analyzing reading highlights to find genuine conceptual connections.\n\n'
      + 'SOURCE HIGHLIGHT:\n"' + h.text.slice(0, 300) + '"\n'
      + 'From: ' + h.title.slice(0, 60) + ' by ' + h.author + '\n\n'
      + 'CANDIDATE HIGHLIGHTS (numbered 0-' + (candidates.length - 1) + '):\n'
      + candidateList + '\n\n'
      + 'Find the 4-5 candidates that connect most meaningfully to the source highlight through shared IDEAS, THEMES, or INTELLECTUAL TENSIONS — not just shared words.\n'
      + 'Look for: same concept explored differently, contrasting perspectives, one idea illuminating another, surprising parallels.\n\n'
      + 'Respond with ONLY a JSON array. No markdown, no explanation outside the JSON:\n'
      + '[{"index": 0, "connection": "One sentence explaining the conceptual link"}, ...]\n'
      + 'Return exactly 4-5 items, ordered by strength of connection.';

    try {
      var resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      var data = await resp.json();
      var text = (data.content || []).filter(function(c) { return c.type === 'text'; }).map(function(c) { return c.text; }).join('');
      // strip markdown fences if present
      text = text.replace(/```json|```/g, '').trim();
      var parsed = JSON.parse(text);
      var results = parsed.map(function(item) {
        return { h: candidates[item.index], connection: item.connection };
      }).filter(function(x) { return x.h; });
      connCache[h.id] = results;
      return results;
    } catch(e) {
      return null; // fall back to word-matching
    }
  }

  /* ══════════════════════════════════════
     IDEA MAP (#6)
  ══════════════════════════════════════ */

  var mapPositions = null; // cached book positions
  var MAP = { canvas: null, ctx: null, width: 0, height: 0, animFrame: null,
              scale: 1, panX: 0, panY: 0, isPanning: false, lastPanX: 0, lastPanY: 0,
              hoveredBook: null, expandedBook: null, hlNodes: [] };

  async function computeMapPositions() {
    // Check localStorage cache first
    var cached = localStorage.getItem('rw_map_positions_v2');
    if (cached) {
      try { return JSON.parse(cached); }
      catch(e) {}
    }

    // Build book data for Claude
    var books = {};
    HIGHLIGHTS.forEach(function(h) {
      if (!books[h.title]) books[h.title] = { author: h.author, theme: h.theme, count: 0, samples: [] };
      books[h.title].count++;
      if (books[h.title].samples.length < 2) books[h.title].samples.push(h.text.slice(0, 80));
    });

    var bookList = Object.entries(books).map(function(e, i) {
      return i + ': ' + e[0].slice(0, 50) + ' [' + e[1].theme + '] — ' + e[1].samples[0];
    }).join('\n');

    var prompt = 'You are creating a 2D conceptual map of books based on their ideas.\n\n'
      + 'Place these books in a 2D space (x: -100 to 100, y: -100 to 100) so that:\n'
      + '- Books with closely related IDEAS are near each other\n'
      + '- Books with contrasting or unrelated ideas are far apart\n'
      + '- Use the full space — spread books out, avoid clustering everything in the center\n'
      + '- Consider: systems thinking, decision-making, economics, politics, personal growth, fiction, technology\n\n'
      + 'BOOKS:\n' + bookList + '\n\n'
      + 'Respond with ONLY a JSON array, no markdown:\n'
      + '[{"index": 0, "x": 45, "y": -23}, ...]\n'
      + 'Return ALL ' + Object.keys(books).length + ' books.';

    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    var data = await resp.json();
    var text = (data.content || []).filter(function(c) { return c.type === 'text'; }).map(function(c) { return c.text; }).join('');
    text = text.replace(/```json|```/g, '').trim();
    var coords = JSON.parse(text);

    // Combine with book data
    var bookEntries = Object.entries(books);
    var positions = coords.map(function(c) {
      var entry = bookEntries[c.index];
      if (!entry) return null;
      return {
        title: entry[0],
        author: entry[1].author,
        theme: entry[1].theme,
        count: entry[1].count,
        x: c.x,
        y: c.y
      };
    }).filter(Boolean);

    localStorage.setItem('rw_map_positions_v2', JSON.stringify(positions));
    return positions;
  }

  function renderIdeaMap() {
    var mc = document.getElementById('main');
    mc.innerHTML = '<div id="map-wrap">'
      + '<div id="map-toolbar">'
      + '<span id="map-status">Building your idea map with Claude…</span>'
      + '<div id="map-tools">'
      + '<button class="map-tool-btn" id="map-reset-btn">Reset view</button>'
      + '<button class="map-tool-btn" id="map-clear-cache-btn">Refresh map</button>'
      + '</div></div>'
      + '<div id="map-hint">Scroll to zoom &middot; Drag to pan &middot; Click a book to explore its highlights</div>'
      + '<canvas id="map-canvas"></canvas>'
      + '<div id="map-detail"></div>'
      + '</div>';

    var canvas = document.getElementById('map-canvas');
    MAP.canvas = canvas;
    MAP.ctx = canvas.getContext('2d');

    function resizeCanvas() {
      var wrap = document.getElementById('map-wrap'); if (!wrap) return;
      MAP.width = wrap.clientWidth;
      MAP.height = Math.max(500, window.innerHeight - 160);
      canvas.width = MAP.width * window.devicePixelRatio;
      canvas.height = MAP.height * window.devicePixelRatio;
      canvas.style.width = MAP.width + 'px';
      canvas.style.height = MAP.height + 'px';
      MAP.ctx.setTransform(1,0,0,1,0,0);
      MAP.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      if (mapPositions) drawMap();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.getElementById('map-reset-btn').addEventListener('click', function() {
      MAP.scale = 1; MAP.panX = 0; MAP.panY = 0;
      MAP.expandedBook = null; MAP.hlNodes = [];
      document.getElementById('map-detail').innerHTML = '';
      drawMap();
    });
    document.getElementById('map-clear-cache-btn').addEventListener('click', function() {
      localStorage.removeItem('rw_map_positions_v2');
      mapPositions = null; MAP.expandedBook = null; MAP.hlNodes = [];
      document.getElementById('map-status').textContent = 'Rebuilding map…';
      loadAndDrawMap();
    });

    loadAndDrawMap();
  }

  async function loadAndDrawMap() {
    try {
      mapPositions = await computeMapPositions();
      document.getElementById('map-status').textContent = 'Your reading — ' + mapPositions.length + ' books mapped by conceptual proximity';
      MAP.scale = 1; MAP.panX = 0; MAP.panY = 0;
      drawMap();
      bindMapEvents();
    } catch(e) {
      var el = document.getElementById('map-status');
      if (el) el.textContent = 'Map error: ' + e.message;
    }
  }

  function worldToScreen(wx, wy) {
    var cx = MAP.width / 2 + MAP.panX;
    var cy = MAP.height / 2 + MAP.panY;
    var spread = Math.min(MAP.width, MAP.height) * 0.42 * MAP.scale;
    return {
      x: cx + wx / 100 * spread,
      y: cy + wy / 100 * spread
    };
  }

  function screenToWorld(sx, sy) {
    var cx = MAP.width / 2 + MAP.panX;
    var cy = MAP.height / 2 + MAP.panY;
    var spread = Math.min(MAP.width, MAP.height) * 0.42 * MAP.scale;
    return {
      x: (sx - cx) / spread * 100,
      y: (sy - cy) / spread * 100
    };
  }

  function bookRadius(b) {
    return Math.max(14, Math.min(38, 10 + b.count * 0.06)) * Math.sqrt(MAP.scale);
  }

  function drawMap() {
    if (!mapPositions || !MAP.ctx) return;
    var ctx = MAP.ctx, W = MAP.width, H = MAP.height;
    ctx.clearRect(0, 0, W, H);

    // subtle grid
    ctx.strokeStyle = '#e8e4dc';
    ctx.lineWidth = 0.5;
    var spread = Math.min(W, H) * 0.42 * MAP.scale;
    var cx = W/2 + MAP.panX, cy = H/2 + MAP.panY;
    [-100,-75,-50,-25,0,25,50,75,100].forEach(function(v) {
      var sx = cx + v/100*spread, sy = cy + v/100*spread;
      ctx.beginPath(); ctx.moveTo(sx,0); ctx.lineTo(sx,H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,sy); ctx.lineTo(W,sy); ctx.stroke();
    });

    // draw connections between expanded book's highlights and other books (if any)
    if (MAP.expandedBook && MAP.hlNodes.length) {
      // draw faint lines from expanded book to related books (same theme)
      mapPositions.forEach(function(b) {
        if (b.title === MAP.expandedBook.title) return;
        if (b.theme !== MAP.expandedBook.theme) return;
        var s = worldToScreen(MAP.expandedBook.x, MAP.expandedBook.y);
        var t = worldToScreen(b.x, b.y);
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = (THEME_COLORS[b.theme] || '#999') + '30';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // draw books
    mapPositions.forEach(function(b) {
      var pos = worldToScreen(b.x, b.y);
      var r = bookRadius(b);
      var color = THEME_COLORS[b.theme] || '#888';
      var isHov = MAP.hoveredBook && MAP.hoveredBook.title === b.title;
      var isExp = MAP.expandedBook && MAP.expandedBook.title === b.title;
      var isDim = (MAP.expandedBook && !isExp);

      ctx.globalAlpha = isDim ? 0.35 : 1;
      if (isHov || isExp) { ctx.shadowColor = color; ctx.shadowBlur = 16; }

      // circle
      ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isExp ? color + 'dd' : color + '28';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isExp ? 2.5 : isHov ? 2 : 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // label
      var maxW = r * 3.5;
      var shortTitle = b.title.length > 28 ? b.title.slice(0, 26) + '…' : b.title;
      ctx.fillStyle = isExp ? color : (isDim ? color + '80' : color + 'cc');
      ctx.font = (isExp ? '500 ' : '') + Math.max(10, Math.min(13, r * 0.7)) + 'px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // wrap label into 2 lines if needed
      var words = shortTitle.split(' ');
      var line1 = '', line2 = '';
      var mid = Math.ceil(words.length / 2);
      line1 = words.slice(0, mid).join(' ');
      line2 = words.slice(mid).join(' ');

      if (line2) {
        ctx.fillText(line1, pos.x, pos.y - 7);
        ctx.fillText(line2, pos.x, pos.y + 7);
      } else {
        ctx.fillText(line1, pos.x, pos.y);
      }

      // count badge
      ctx.font = '10px DM Sans, sans-serif';
      ctx.fillStyle = color + '88';
      ctx.fillText(b.count, pos.x, pos.y + r + 12);

      ctx.globalAlpha = 1;
    });

    // draw expanded highlight nodes
    if (MAP.hlNodes.length) {
      var bookPos = worldToScreen(MAP.expandedBook.x, MAP.expandedBook.y);
      MAP.hlNodes.forEach(function(node) {
        // line from book to highlight node
        ctx.beginPath(); ctx.moveTo(bookPos.x, bookPos.y); ctx.lineTo(node.sx, node.sy);
        ctx.strokeStyle = (THEME_COLORS[MAP.expandedBook.theme] || '#888') + '40';
        ctx.lineWidth = 1; ctx.stroke();

        // highlight node
        var isHov = MAP.hoveredHL && MAP.hoveredHL === node;
        ctx.beginPath(); ctx.arc(node.sx, node.sy, isHov ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = THEME_COLORS[MAP.expandedBook.theme] || '#888';
        ctx.globalAlpha = isHov ? 1 : 0.6;
        ctx.fill(); ctx.globalAlpha = 1;
      });
    }
  }

  function expandBook(book) {
    MAP.expandedBook = book;
    // Get highlights for this book
    var hls = HIGHLIGHTS.filter(function(h) { return h.title === book.title; });
    // Arrange highlights in a circle around the book
    var pos = worldToScreen(book.x, book.y);
    var r = bookRadius(book) + 50 + Math.min(hls.length * 2, 40);
    MAP.hlNodes = hls.map(function(h, i) {
      var angle = (i / hls.length) * Math.PI * 2 - Math.PI / 2;
      return {
        h: h,
        sx: pos.x + Math.cos(angle) * r,
        sy: pos.y + Math.sin(angle) * r
      };
    });

    // Show detail panel
    var color = THEME_COLORS[book.theme] || '#2d5a3d';
    var detail = document.getElementById('map-detail');
    detail.innerHTML = '<div class="map-detail-inner">'
      + '<div class="map-detail-header" style="border-left:3px solid '+color+'">'
      + '<div class="map-detail-title">'+esc(book.title)+'</div>'
      + '<div class="map-detail-meta">'+esc(book.author)+' &middot; <span style="color:'+color+'">'+esc(book.theme)+'</span> &middot; '+book.count+' highlights</div>'
      + '</div>'
      + '<div class="map-detail-hls" id="map-hl-list">'
      + hls.map(function(h) {
          return '<div class="map-hl-item" data-id="'+h.id+'">'
            + '<div class="map-hl-text">'+esc(h.text.slice(0,180))+(h.text.length>180?'…':'')+'</div>'
            + (h.note ? '<div class="map-hl-note">'+esc(h.note)+'</div>' : '')
            + '<div class="map-hl-date">'+fdate(h.date)+'</div>'
            + '</div>';
        }).join('')
      + '</div></div>';

    drawMap();

    // Clicking a highlight in the panel switches to connections view
    detail.querySelectorAll('.map-hl-item').forEach(function(el) {
      el.addEventListener('click', function() {
        var id = parseInt(el.dataset.id);
        S.tab = 'highlights'; S.view = 'conn'; S.sel = id;
        if (MAP.animFrame) { cancelAnimationFrame(MAP.animFrame); MAP.animFrame = null; }
        render();
      });
    });
  }

  function bindMapEvents() {
    var canvas = MAP.canvas; if (!canvas) return;

    function getCanvasXY(e) {
      var rect = canvas.getBoundingClientRect();
      var touch = e.touches ? e.touches[0] : e;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    function getBookAt(x, y) {
      if (!mapPositions) return null;
      for (var i = mapPositions.length - 1; i >= 0; i--) {
        var b = mapPositions[i];
        var pos = worldToScreen(b.x, b.y);
        var r = bookRadius(b);
        var dx = x - pos.x, dy = y - pos.y;
        if (dx*dx + dy*dy <= r*r) return b;
      }
      return null;
    }

    canvas.addEventListener('wheel', function(e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? 0.9 : 1.1;
      // zoom toward cursor
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top;
      var wx = (mx - MAP.width/2 - MAP.panX), wy = (my - MAP.height/2 - MAP.panY);
      MAP.scale = Math.max(0.4, Math.min(4, MAP.scale * delta));
      MAP.panX = mx - MAP.width/2 - wx * delta;
      MAP.panY = my - MAP.height/2 - wy * delta;
      // recalculate hlNodes positions if expanded
      if (MAP.expandedBook) expandBook(MAP.expandedBook);
      else drawMap();
    }, { passive: false });

    canvas.addEventListener('mousedown', function(e) {
      var p = getCanvasXY(e);
      var book = getBookAt(p.x, p.y);
      if (book) { expandBook(book); return; }
      MAP.isPanning = true; MAP.lastPanX = p.x; MAP.lastPanY = p.y;
      canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('mousemove', function(e) {
      var p = getCanvasXY(e);
      if (MAP.isPanning) {
        MAP.panX += p.x - MAP.lastPanX; MAP.panY += p.y - MAP.lastPanY;
        MAP.lastPanX = p.x; MAP.lastPanY = p.y;
        drawMap(); return;
      }
      var book = getBookAt(p.x, p.y);
      if (book !== MAP.hoveredBook) { MAP.hoveredBook = book; canvas.style.cursor = book ? 'pointer' : 'grab'; drawMap(); }
    });
    canvas.addEventListener('mouseup', function() { MAP.isPanning = false; canvas.style.cursor = MAP.hoveredBook ? 'pointer' : 'grab'; });
    canvas.addEventListener('mouseleave', function() { MAP.isPanning = false; MAP.hoveredBook = null; drawMap(); });
    canvas.style.cursor = 'grab';
  }

})();
