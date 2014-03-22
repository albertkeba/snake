/**
 * @author	Albert KEBA MAGNAGNA
 * @version	1.0
 */
var app = {
	showDebug	: false,
	active		: true,
	context		: null,
	score		: 0,
	level		: 0,
	direction	: 0,
	speed		: 1,
	canvasWidth	: 200,
	canavasHeight: 200,
	map			: new Array(20),
	snake		: new Array(3),
	foodCollision: new Event( this ),

	init: function( id ){
		'use strict';
		
		//-- initialize the matrix
		for ( var i=0; i<this.map.length; i++)
		{
			this.map[i] = new Array(20);
		}

		this.debug('init');

		this.drawCanvas( id );
		this.drawRandomFood();
		this.drawSnake();
		this.drawGame();
		//console.log( this.context);
	},
	drawCanvas: function( id ){
		'use strict';
		var canvas	= document.createElement('canvas');
			canvas.width = this.canvasWidth;
			canvas.height= this.canavasHeight;
			canvas.style.border = '#eee 1px solid';

		this.context = canvas.getContext('2d');

		$('#' + id).append( canvas );

		this.debug('draw canvas');

		this.canvas = canvas;
	},
	drawRandomFood: function(){
		'use strict';

		//-- generate random position
		var rndX	= Math.round( Math.random() * 19 ),
			rndY	= Math.round( Math.random() * 19 );

		//-- make single place
		while ( this.map[rndX][rndY] === 2 )
		{
			rndX = Math.round( Math.random() * 19 );
			rndY = Math.round( Math.random() * 19 );
		}

		this.map[rndX][rndY] = 1;
		this.debug(rndX, rndY);
	},
	drawSnake: function(){
		'use strict';
		var rndX = 10,
			rndY = 10;

		for ( var i=0; i<this.snake.length; i++)
		{
			this.snake[i] = {x: rndX-i, y: rndY};
			this.map[rndX-i][rndY] = 2;
		}
	},
	drawGame: function () {
		'use strict';

		if ( this.active )
		{
			this.context.clearRect(0, 0, this.canvasWidth, this.canavasHeight);

			for ( var i=this.snake.length-1; i>=0; i-- )
			{		
				if ( i === 0 )
				{
					switch( this.direction )
					{
						case 0: //-- right
							this.snake[0] = {x: this.snake[0].x + 1, y: this.snake[0].y};
							break;
						case 1: //-- left
							this.snake[0] = {x: this.snake[0].x - 1, y: this.snake[0].y};
							break;
						case 2: //-- up
							this.snake[0] = {x: this.snake[0].x, y: this.snake[0].y - 1};
							break;
						case 3: //-- down
							this.snake[0] = {x: this.snake[0].x, y: this.snake[0].y + 1};
							break;
					}

					//-- check if it's out of bound
					if (	this.snake[0].x <  0	|| 
							this.snake[0].x >= 20	||
							this.snake[0].y <  0	||
							this.snake[0].y >= 20
						)
					{
						//-- game over
						return;
					}

					//-- detect food collision
					if ( this.map[ this.snake[0].x ][ this.snake[0].y ] === 1 )
					{
						this.score += 10;
						this.drawRandomFood();

						this.snake.push({
							x: this.snake[ this.snake.length - 1 ].x,
							y: this.snake[ this.snake.length - 1 ].y
						});

						this.map[ this.snake[ this.snake.length - 1].x ][ this.snake[ this.snake.length - 1].y ] = 2;

						if ( (this.score % 100) === 0 )
							this.level += 1;
						console.log('score: '+this.score);

						this.foodCollision.notify({
							points: this.score
						});

						//-- detect snake collision
					}
					else if ( this.map[ this.snake[0].x ][ this.snake[0].y ] === 2 )
					{
						//-- game over
						return;
					}

					this.map[ this.snake[0].x ][ this.snake[0].y ] = 2;
				}
				else
				{
					if ( i === ( this.snake.length - 1 ) )
						this.map[ this.snake[i].x ][ this.snake[i].y ] = null;
					
					this.snake[i] = {x: this.snake[i-1].x, y: this.snake[i-1].y};
					this.map[ this.snake[i].x ][ this.snake[i].y ] = 2;
				}
			}

			for ( var x=0; x<this.map.length; x++ )
			{
				for ( var y=0; y<this.map[0].length; y++ )
				{
					if ( this.map[x][y] === 1 )
					{
						this.context.fillStyle = 'black';
						this.context.fillRect(x * 10, y * 10 +20, 10, 10);
					}
					else if ( this.map[x][y] === 2 )
					{
						this.context.fillStyle = 'orange';
						this.context.fillRect(x * 10, y * 10 + 20, 10, 10);
					}
				}
			}

			//this.speed - (this.level * 50)
			setTimeout(this.drawGame.bind(this), 1000);
		}
	},
	debug: function( data ) {
		if ( this.showDebug )
		{
			console.log( data );
		}
	}
};