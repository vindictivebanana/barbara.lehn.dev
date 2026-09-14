// Barbara Barbara — shared site script

// Fill in the current year in the footer on every page.
document.querySelectorAll('#year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

/* -----------------------------------------------------------------------
   Pulling in real Yelp / Google reviews
   -----------------------------------------------------------------------
   Both Yelp's Fusion API and Google's Places API require a private API
   key, and neither allows those keys to be called directly from a
   plain HTML/JS site (the key would be visible to anyone who views the
   page source, and both companies block that for security). Getting
   live reviews requires a small server in between — something that
   holds the API key privately, fetches the reviews, and hands back
   just the data. That's a bigger project than this site, and it also
   means paying for and maintaining that server.

   A simpler middle ground, if this is ever wanted later:
     - Yelp offers an official embeddable "Yelp Review Button" / badge
       that links out to your live Yelp rating — no API key needed.
     - Google doesn't offer a no-key embed, but the "Read us on Google"
       button above links straight to the shop's live review page,
       which is the standard lightweight approach small businesses use.

   If a live feed is ever wanted, the function below shows the shape
   the code would take, using a placeholder endpoint. It is not called
   anywhere on the site right now.
------------------------------------------------------------------------*/

async function loadLiveReviews(endpointUrl) {
  var grid = document.getElementById('review-grid');
  var loadingMsg = document.getElementById('loading-msg');
  if (!grid) return;

  try {
    if (loadingMsg) loadingMsg.classList.add('active');

    // endpointUrl would point to your own small server, e.g.
    // "https://your-server.example.com/api/reviews"
    // — never a Yelp/Google API URL directly from the browser.
    var response = await fetch(endpointUrl);
    var reviews = await response.json();

    grid.innerHTML = '';
    reviews.forEach(function (review) {
      var card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML =
        '<div class="stars">' + '&#9733;'.repeat(review.rating || 5) + '</div>' +
        '<p class="quote">"' + review.text + '"</p>' +
        '<div class="who"><span>' + review.author + '</span><span>' + review.source + '</span></div>';
      grid.appendChild(card);
    });
  } catch (err) {
    console.warn('Could not load live reviews, showing static reviews instead.', err);
  } finally {
    if (loadingMsg) loadingMsg.classList.remove('active');
  }
}
