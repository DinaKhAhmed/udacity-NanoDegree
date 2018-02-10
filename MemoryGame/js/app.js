

(function () {
	/*
	 * Create a list that holds all of your cards
	 */
	//json of cards data
	let cards = [
		{
			icon: "fa fa-diamond",
			id: 1,
		},
		{
			icon: "fa fa-paper-plane-o",
			id: 2
		},
		{
			icon: "fa fa-anchor",
			id: 3
		},
		{
			icon: "fa fa-bolt",
			id: 4
		},
		{
			icon: "fa fa-cube",
			id: 5
		},
		{
			icon: "fa fa-leaf",
			id: 6
		},
		{
			icon: "fa fa-bicycle",
			id: 7
		},
		{
			icon: "fa fa-bomb",
			id: 8
		}
	];
	/****Game Variabes*** */
	let minutesLabel = document.getElementById("minutes");
	let secondsLabel = document.getElementById("seconds");
	let movesLabel = document.getElementById("moves");
	let movesthreshold = cards.length;
	let ratingContainer = $(".score-panel .stars");
	let timerContainer = $(".score-panel .time-taken");
	let movesContainer = $(".score-panel .moves");
	let noOfMoves = 0;
	let totalSeconds = 0;
	let startTimer = null;

	/********Function responsible for cloning Rating, Time and Moves to popup******* */
	function cloneDetails() {
		$(".cloned-rating,.cloned-time,.cloned-moves").html("");
		ratingContainer.clone().prependTo(".cloned-rating");
		timerContainer.clone().prependTo(".cloned-time");
		movesContainer.clone().prependTo(".cloned-moves");
	}

	/***********Count up Timer******** */
	function setTime() {
		++totalSeconds;
		secondsLabel.innerHTML = pad(totalSeconds % 60);
		minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
	}
	/*****Handles Minutes and Seconds when above 9******** */
	function pad(val) {
		let valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}
	/*********Reset Timer******* */
	function resetTimer() {
		clearInterval(startTimer);
		startTimer = null;
		totalSeconds = 0;
		secondsLabel.innerHTML = "00";
		minutesLabel.innerHTML = "00";
	}

	/*********Set Rating based on cards Array length*********** */
	function setRating(moves) {
		if (moves >= (movesthreshold * 1.5)) {
			ratingContainer.width(18);
		}
		else if (moves >= movesthreshold) {
			ratingContainer.width(36);

		}
		else {
			ratingContainer.removeAttr("style");

		}
	}


	/********Count User Moves********* */
	function countMoves() {
		noOfMoves++;
		movesLabel.innerHTML = noOfMoves;
		setRating(noOfMoves);
	}

	/*********Reset Moves Count******* */
	function resetMovesCount() {
		noOfMoves = 0;
		movesLabel.innerHTML = 0;
	}

	// Memory Card Game Class
	let memoryCardGame = function (cards) {
		this.cardsContainer = $(".deck");
		this.modal = $(".modal");
		this.overlay = $(".modal-overlay");
		this.restartButton = $(".restart");
		this.cardsArray = $.merge(cards, cards);
		this.paused = false;
		this.previousCard = null;
	};

	// function to initialize the game on first time page loads
	memoryCardGame.prototype.init = function () {
		this.shuffleCards(this.cardsArray);
		this.setup();
	}
	// Change cards places (called on Init and on restart)
	memoryCardGame.prototype.shuffleCards = function (cardsArray) {
		this.cards = $(this.shuffle(this.cardsArray));
	};

	//Setup memory game with needed Data
	memoryCardGame.prototype.setup = function () {
		this.html = this.drawCards();
		this.cardsContainer.html(this.html);
		this.memoryCards = $(".card");
		this.clicksBinding();
	};

	// Binds Click to Each card and reset and Play again buttons
	memoryCardGame.prototype.clicksBinding = function () {
		this.memoryCards.on("click", { classObject: this }, this.cardOnClick);
		this.restartButton.on("click", { classObject: this }, this.reset);
	};

	// Card Click Logic
	memoryCardGame.prototype.cardOnClick = function (event) {

		let $card = $(this);
		let $memoryObj = event.data.classObject;
		if (!$memoryObj.paused && !$card.hasClass("match") && !$card.hasClass("open")) {


			$card.addClass("open");
			if (!$memoryObj.previousCard) {
				clearInterval(startTimer);
				startTimer = setInterval(setTime, 1000);

				$memoryObj.previousCard = $(this).attr("data-key");
			} else if ($card.attr("data-key") == $memoryObj.previousCard && !$card.hasClass("match")) {
				$(".open").addClass("match");
				$memoryObj.previousCard = null;
				countMoves();
			} else {


				$memoryObj.previousCard = null;
				$memoryObj.paused = true;
				countMoves();

				setTimeout(function () {
					$(".open").removeClass("open");
					$memoryObj.paused = false;
				}, 600);
			}
			if ($(".match").length == $(".card").length) {
				clearInterval(startTimer);

				$memoryObj.win();

			}
		}

	};

	// Game Winning Logic
	memoryCardGame.prototype.win = function () {
		this.paused = true;
		let context = this;
		setTimeout(function () {
			cloneDetails();
			context.showWinPopup();
			context.cardsContainer.fadeOut();
		}, 300);
	};

	// Show popup on winning
	memoryCardGame.prototype.showWinPopup = function () {
		this.overlay.show();
		this.modal.fadeIn("slow");
	};

	//Hide popup on pressing play again
	memoryCardGame.prototype.hideWinPopup = function () {
		this.overlay.hide();
		this.modal.hide();
	};

	// reset Game called by clicking on reset button and play again button
	memoryCardGame.prototype.reset = function (event) {
		let $memoryObj = event.data.classObject;
		$memoryObj.previousCard = null;		
		$memoryObj.hideWinPopup();
		$memoryObj.shuffleCards($memoryObj.cardsArray);
		$memoryObj.setup();
		$memoryObj.paused = false;
		$memoryObj.cardsContainer.show("slow");
		resetTimer();
		resetMovesCount();
		ratingContainer.removeAttr("style");



	};

	// Shuffle function from http://stackoverflow.com/a/2450976
	memoryCardGame.prototype.shuffle = function (array) {
		let currentIndex = array.length, temporaryValue, randomIndex;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};
	// render cards html
	memoryCardGame.prototype.drawCards = function () {
		let cardsSet = '';
		this.cards.each(function (k, v) {
			cardsSet += '<li class="card" data-key="' + v.id + '"><i class="' + v.icon +
				'" <i/></li>';
		});
		return cardsSet;
	}
	// Initializing game
	memoryCardGameObj = new memoryCardGame(cards);
	memoryCardGameObj.init();
})();
