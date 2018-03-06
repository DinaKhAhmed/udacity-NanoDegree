/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

$(function () {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function () {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('All feeds are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        //check that every feed has URL and not empty
        it('Ensures that every feed has a URL defined', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            });
        });
        // check that every feed has name and not empty
        it('Ensures that every feed has a name defined', function () {
            allFeeds.forEach(function (feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
            });
        });
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function () {
        //check if the first state of the menu is hidden
        it('Is hidden by default', function () {
            expect($('body').hasClass('menu-hidden')).toBeTruthy();
        });

        //make sure that the menu show and hide on each click of the icon
        it('Toggles when the icon is clicked', function () {
            $('.menu-icon-link').click();
            expect($('body').hasClass('menu-hidden')).toBeFalsy();

            $('.menu-icon-link').click();
            expect($('body').hasClass('menu-hidden')).toBeTruthy(true);
        });
    });


    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function () {
        //this will be excuted befor runing the spec
        beforeEach(function (done) {
            //call loadFeed for the first time
            loadFeed(0, function () {
                done();
            });
        });

        //test the length of the entries to check that there is intially entries loaded
        it('Should contain at least single entry', function (done) {
            expect($('.feed .entry').length).toBeGreaterThan(0);
            done();
        });

    });
    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function () {
        var oldContent;
        var newContent;
        beforeEach(function (done) {
            //async loadfeed function called
            loadFeed(0, function () {
                //fetch the content of allfeeds[0]
                oldContent = $('.feed').text();
                // console.log(oldContent);
                //async loadfeed function called again with diffrent url
                loadFeed(1, function () {
                    //fetch the content of allfeeds[1]
                    newContent = $('.feed').text();
                    // console.log(newContent);
                    done();
                });
            });
        });

        //test if the new content not equal the old content
        it('Is diffrent from old feed', function (done) {
            expect(oldContent).not.toEqual(newContent);
            done();
        });
    });

}());
