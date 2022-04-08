const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './assets/img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player1 = new Fighter({
    position: {
        x: 80,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/img/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/img/samuraiMack/idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/img/samuraiMack/run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/img/samuraiMack/jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/img/samuraiMack/fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/img/samuraiMack/attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const player2 = new Fighter({
    position: {
        x: 500,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/img/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/img/kenji/idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/img/kenji/run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/img/kenji/jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/img/kenji/fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/img/kenji/attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -172,
            y: 50
        },
        width: 172,
        height: 50
    }
})

console.log(player1)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player1.update()
    player2.update()

    player1.velocity.x = 0
    player2.velocity.x = 0

    // player1 movement
    if (keys.a.pressed && player1.lastKey === 'a') {
        player1.velocity.x = -5
        player1.switchSprite('run')
    } else if (keys.d.pressed && player1.lastKey === 'd') {
        player1.velocity.x = 5
        player1.switchSprite('run')
    } else {
        player1.switchSprite('idle')
    }

    //Jumping
    if (player1.velocity.y < 0) {
        player1.switchSprite('jump')
    } else if (player1.velocity.y > 0) {
        player1.switchSprite('fall')
    }


    // player2 movement
    if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
        player2.velocity.x = -5
        player2.switchSprite('run')
    } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
        player2.velocity.x = 5
        player2.switchSprite('run')
    } else {
        player2.switchSprite('idle')
    }

    // jumping
    if (player2.velocity.y < 0) {
        player2.switchSprite('jump')
    } else if (player2.velocity.y > 0) {
        player2.switchSprite('fall')
    }

    //detect collision & player2 gets hit
    if (rectangularCollision({
            rectangle1: player1,
            rectangle2: player2
        }) &&
        player1.isAttacking && player1.framesCurrent === 4) {
        player2.takeHit()
        player1.isAttacking = false

        gsap.to('#player2Health', {
            width: player2.health + '%'
        })
    }

    // if player1 misses
    if (player1.isAttacking && player1.framesCurrent === 4) {
        player1.isAttacking = false
    }

    // player1 gets hit
    if (rectangularCollision({
            rectangle1: player2,
            rectangle2: player1
        }) &&
        player2.isAttacking && player2.framesCurrent === 2) {
        player1.takeHit()
        player2.isAttacking = false

        gsap.to('#player1Health', {
            width: player1.health + '%'
        })
    }

    // if player2 misses
    if (player2.isAttacking && player2.framesCurrent === 2) {
        player2.isAttacking = false
    }

    // End game based on health
    if (player2.health <= 0 || player1.health <= 0) {
        determineWinner({
            player1,
            player2,
            timerId
        })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player1.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player1.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player1.lastKey = 'a'
                break
            case 'w':
                player1.velocity.y = -20
                break
            case ' ':
                player1.attack()
                break
        }
    }
    if (!player2.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                player2.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                player2.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                player2.velocity.y = -20
                break
            case 'ArrowDown':
                player2.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.a.pressed = false
            break
    }

    // player2 keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }

    console.log(event.key);
})