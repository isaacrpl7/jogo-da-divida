export function getCard(card_id) {
    const cards = {
        // CARTAS DE AÇÃO
        0: {
            name: 'Político Amigo',
            description: 'Impede que você seja preso. Não pode ser bloqueado.'
        },
        1: {
            name: 'Devedora Antiga',
            description: 'Impede que você seja morto. Não pode ser bloqueado.'
        },
        2: {
            name: 'Herança de Família',
            description: 'Use a carta para ganhar 5000.'
        },
        3: {
            name: 'Poupança',
            description: 'Use a carta para ganhar 2000.'
        },
        4: {// Verificar como implementar
            name: 'Informação Privilegiada',
            description: 'Veja as próximas 3 cartas do bolo e depois devolva-as na mesma posição.'
        },
        5: {// Verificar como implementar
            name: 'Informação Privilegiada',
            description: 'Veja as próximas 3 cartas do bolo e depois devolva-as na mesma posição.'
        },
        6: {
            name: 'Ações da bolsa',
            description: 'Jogue o dado e descubra se ganha ou paga: 1-2 pague 2000, 3-4 nada, 5-6 ganhe 5000.'
        },
        7: {
            name: 'Ações da bolsa',
            description: 'Jogue o dado e descubra se ganha ou paga: 1-2 pague 2000, 3-4 nada, 5-6 ganhe 5000.'
        },
        8: {
            name: 'Camaradagem',
            description: 'Divida o dinheiro ganho pela metade com quem jogou esta carta.'
        },
        9: {
            name: 'Camaradagem',
            description: 'Divida o dinheiro ganho pela metade com quem jogou esta carta.'
        },
        10: {
            name: 'Corrupção',
            description: 'Dobre o dinheiro ganho.'
        },
        11: {
            name: 'Corrupção',
            description: 'Dobre o dinheiro ganho.'
        },
        12: {
            name: 'Mão amiga',
            description: 'Só precisa pagar metade do dinheiro.'
        },
        13: {
            name: 'Negociar',
            description: 'Só precisa pagar metade do dinheiro.'
        },
        14: {
            name: 'Mão inimiga',
            description: 'Dobre a quantia que precisa pagar.'
        },
        15: {
            name: 'Mão inimiga',
            description: 'Dobre a quantia que precisa pagar.'
        },
        16: { // Verificar como implementar
            name: 'Mídia',
            description: 'Impede de usar alguma ação.'
        },
        17: { // Verificar como implementar
            name: 'Cada cachorro que lamba sua caceta',
            description: 'Impede de usar alguma ação.'
        },
        18: { // Verificar como implementar
            name: 'O problema não é meu',
            description: 'Repassa o obstáculo para outro jogador.'
        },
        19: {// Verificar como implementar
            name: 'O problema não é meu',
            description: 'Repassa o obstáculo para outro jogador.'
        },
        20: {// Verificar como implementar
            name: 'Tô fora!',
            description: 'Encerre seu turno sem precisar puxar carta.'
        },
        21: {// Verificar como implementar
            name: 'Tô fora!',
            description: 'Encerre seu turno sem precisar puxar carta.'
        },
        22: {// Verificar como implementar
            name: 'Dobro e passo pro próximo',
            description: 'Pule seu turno e faça o próximo jogador ter 2 turnos.'
        },
        23: {
            name: 'Mendigar',
            description: 'Escolha um jogador para te doar uma carta escolhida por ele.'
        },

        // CARTAS DE OBSTÁCULOS VERMELHOS
        24: {
            name: 'Golpe da mãe sequestrada',
            description: 'Role o dado e descubra se caiu no golpe ou não: 5-6 = escapou, 1,2,3,4 = pague 2000 pro banco'
        },
        25: {
            name: 'Golpe da mãe sequestrada',
            description: 'Role o dado e descubra se caiu no golpe ou não: 5-6 = escapou, 1,2,3,4 = pague 2000 pro banco'
        },
        26: { // Verificar como implementar (CARTA ATIVA TB)
            name: 'Esquema de pirâmide',
            description: 'O primeiro integrante pode extorquir os próximos. Descartar caso a pessoa do topo queira reivindicar o dinheiro. O topo recebe 3000 de cada jogador da pirâmide.'
        },
        27: {
            name: 'Esquema de pirâmide',
            description: 'O primeiro integrante pode extorquir os próximos. Descartar caso a pessoa do topo queira reivindicar o dinheiro. O topo recebe 3000 de cada jogador da pirâmide.'
        },
        28: {
            name: 'Esquema de pirâmide',
            description: 'O primeiro integrante pode extorquir os próximos. Descartar caso a pessoa do topo queira reivindicar o dinheiro. O topo recebe 3000 de cada jogador da pirâmide.'
        },
        29: {
            name: 'Esquema de pirâmide',
            description: 'O primeiro integrante pode extorquir os próximos. Descartar caso a pessoa do topo queira reivindicar o dinheiro. O topo recebe 3000 de cada jogador da pirâmide.'
        },
        30: {
            name: 'Esquema de pirâmide',
            description: 'O primeiro integrante pode extorquir os próximos. Descartar caso a pessoa do topo queira reivindicar o dinheiro. O topo recebe 3000 de cada jogador da pirâmide.'
        },
        31: {
            name: 'Receita Federal',
            description: 'Pagar taxa ou rolar dado pra tentar sonegar: pague 2000, para sonegar tem que tirar 5-6, caso falha, pague 4000'
        },
        32: {
            name: 'Receita Federal',
            description: 'Pagar taxa ou rolar dado pra tentar sonegar: pague 2000, para sonegar tem que tirar 5-6, caso falha, pague 4000'
        },
        33: {
            name: 'Agiota',
            description: 'Te oferece dinheiro, ou cobra a dívida. (Caso esteja devendo e não pague, é morto)'
        },
        34: {
            name: 'Agiota',
            description: 'Te oferece dinheiro, ou cobra a dívida. (Caso esteja devendo e não pague, é morto)'
        },
        35: {
            name: 'Agiota',
            description: 'Te oferece dinheiro, ou cobra a dívida. (Caso esteja devendo e não pague, é morto)'
        },
        36: {
            name: 'Agiota Irritado',
            description: 'Te oferece dinheiro, ou cobra a dívida. (Caso esteja devendo, pague imediatamente sem empréstimos, ou seja morto)'
        },
        37: {
            name: 'Agiota Irritado',
            description: 'Te oferece dinheiro, ou cobra a dívida. (Caso esteja devendo, pague imediatamente sem empréstimos, ou seja morto)'
        },
        38: {
            name: 'Agiota Irritado',
            description: 'Te oferece dinheiro, ou cobra a dívida. (Caso esteja devendo, pague imediatamente sem empréstimos, ou seja morto)'
        },
        39: {
            name: 'Auditor Fiscal',
            description: 'Te cobra uma taxa de 1000 imediatamente. Caso esteja endividado com o banco, pague a dívida ou seja preso.'
        },
        40: {
            name: 'Auditor Fiscal',
            description: 'Te cobra uma taxa de 1000 imediatamente. Caso esteja endividado com o banco, pague a dívida ou seja preso.'
        },
        41: {
            name: 'Auditor Fiscal',
            description: 'Te cobra uma taxa de 1000 imediatamente. Caso esteja endividado com o banco, pague a dívida ou seja preso.'
        },
        42: {
            name: 'Auditor Fiscal',
            description: 'Te cobra uma taxa de 1000 imediatamente. Caso esteja endividado com o banco, pague a dívida ou seja preso.'
        },
        43: {
            name: 'Auditor Fiscal',
            description: 'Te cobra uma taxa de 1000 imediatamente. Caso esteja endividado com o banco, pague a dívida ou seja preso.'
        },
        44: {
            name: 'Auditor Fiscal',
            description: 'Te cobra uma taxa de 1000 imediatamente. Caso esteja endividado com o banco, pague a dívida ou seja preso.'
        },
        45: {
            name: 'N caras M motos',
            description: "Reagirão de forma diferente de acordo com sua classe social. Classe A: saldo maior que 10.000 → Paga 2000 Classe B: saldo entre 5.000 e 10.000 → Paga 1000 Classe C: saldo menor que 5.000 → Paga nada"
        },
        46: {
            name: 'N caras M motos',
            description: 'Reagirão de forma diferente de acordo com sua classe social. Classe A: saldo maior que 10.000 → Paga 2000 Classe B: saldo entre 5.000 e 10.000 → Paga 1000 Classe C: saldo menor que 5.000 → Paga nada'
        },
        47: {
            name: 'Ajudar a sogra',
            description: 'Pague 500 pra sua sogra.'
        },
        48: {
            name: 'Carinha que mora logo ali',
            description: 'Pague 200 já, bora.'
        },
        49: {
            name: 'Impostos',
            description: 'Pague 1000 de imposto.'
        },
        50: {
            name: 'Raspadinha',
            description: 'Role o dado e descubra se ganhou ou se gastou em bilhetes: 1-5 = pague 500, 6= ganhe 5000.'
        },
        51: {
            name: 'Raspadinha',
            description: 'Role o dado e descubra se ganhou ou se gastou em bilhetes: 1-5 = pague 500, 6= ganhe 5000.'
        },
        52: {
            name: 'Tremendo FDP',
            description: 'Caso esteja endividado, aumente as dívidas em 10%. (Tanto banco quanto agiota)'
        },
        53: {
            name: 'Tremendo FDP',
            description: 'Caso esteja endividado, aumente as dívidas em 10%. (Tanto banco quanto agiota)'
        },
        54: {
            name: 'Campanha política',
            description: 'Classe A: saldo maior que 10.000 → recebe 1000 Classe B: saldo entre 5.000 e 10.000 → Paga 1000 Classe C: saldo menor que 5.000 → recebe 500'
        },
        55: {
            name: 'Campanha política',
            description: 'Classe A: saldo maior que 10.000 → recebe 1000 Classe B: saldo entre 5.000 e 10.000 → Paga 1000 Classe C: saldo menor que 5.000 → recebe 500'
        },
        56: {
            name: 'Urubu do PIX',
            description: 'Perca 2000.'
        },
        57: {
            name: 'Urubu do PIX',
            description: 'Perca 2000.'
        },
        58: {
            name: 'Collor-zada',
            description: 'Sua poupança foi confiscada. Perca de acordo com a classe: A= perde 5000, B= perde 1000, C= nada.'
        },
        59: {
            name: 'Collor-zada',
            description: 'Sua poupança foi confiscada. Perca de acordo com a classe: A= perde 5000, B= perde 1000, C= nada.'
        },
        60: {
            name: 'Imposto de renda',
            description: 'Pague equivalente a 50% do seu salário, se tiver emprego.'
        },
        61: {
            name: 'Imposto de renda',
            description: 'Pague equivalente a 50% do seu salário, se tiver emprego.'
        },
        62: {
            name: 'Você foi demitido',
            description: 'Perca o emprego.'
        },
        63: {
            name: 'Você foi demitido',
            description: 'Perca o emprego.'
        },

        // CARTAS DE OBSTÁCULOS BÔNUS
        64: {
            name: 'Dinheiro no chão',
            description: 'Pegue dinheiro do chão e ganhe 500 paus.'
        },
        65: {
            name: 'Dinheiro no chão',
            description: 'Pegue dinheiro do chão e ganhe 500 paus.'
        },
        66: {
            name: 'Amigo é coisa pra se guardar',
            description: 'Pegue 2000 de um jogador.'
        },
        67: {
            name: 'Amigo é coisa pra se guardar',
            description: 'Pegue 2000 de um jogador.'
        },
        68: {
            name: 'É dando que se recebe',
            description: 'Todos pagam 1000 a quem puxou.'
        },
        69: {
            name: 'É dando que se recebe',
            description: 'Todos pagam 1000 a quem puxou.'
        },
        70: {
            name: 'Fez hora extra',
            description: 'Receba o salário novamente, caso tenha emprego.'
        },
        71: {
            name: 'Fez hora extra',
            description: 'Receba o salário novamente, caso tenha emprego.'
        },
        72: {
            name: 'X9',
            description: 'Todos devem pagar 1000 ao banco.'
        },
        73: {
            name: 'X9',
            description: 'Todos devem pagar 1000 ao banco.'
        },
        74: {
            name: 'Meu marido tem dois empregos',
            description: 'Você agora pode ter mais de um emprego (perca ao alcançar classe A).'
        },
        75: {
            name: 'Maoê!',
            description: 'Você participou do programa do silvio santos, jogue o dado e ganhe uma grana: 1-2= 500, 3-4=1000, 5-6=2000'
        },
        76: {
            name: 'Maoê!',
            description: 'Você participou do programa do silvio santos, jogue o dado e ganhe uma grana: 1-2= 500, 3-4=1000, 5-6=2000'
        },
        77: {
            name: 'Aprendiz de Ret',
            description: 'Vendeu as marmitas certinho, role o dado e ganhe grana: 1-2= 100, 3-4= 200, 5-6= 500'
        },
        78: {
            name: 'Aprendiz de Ret',
            description: 'Vendeu as marmitas certinho, role o dado e ganhe grana: 1-2= 100, 3-4= 200, 5-6= 500'
        },
        79: {
            name: 'Vendedor de curso',
            description: 'Você vendeu curso, jogue o dado e ganhe grana: 1-2= 500, 3-4= 1000, 5-6= 1500'
        },
        80: {
            name: 'Vendedor de curso',
            description: 'Você vendeu curso, jogue o dado e ganhe grana: 1-2= 500, 3-4= 1000, 5-6= 1500'
        },
        81: {
            name: 'Homem de palavra',
            description: 'Caso não esteja devendo nada a ninguém, ganhe 5000.'
        },
        82: {
            name: 'Homem de palavra',
            description: 'Caso não esteja devendo nada a ninguém, ganhe 5000.'
        },

        // CARTAS DE EMPREGO
        83: {
            name: 'Médico',
            description: 'Salário de 10000'
        },
        84: {
            name: 'Advogado',
            description: 'Salário de 7000'
        },
        85: {
            name: 'Servente de pedreiro',
            description: 'Salário de 1000'
        },
        86: {
            name: 'Desenvolvedor de Software',
            description: 'Salário de 7000'
        },
        87: {
            name: 'Atendente de FastFood',
            description: 'Salário de 1500'
        },
        88: {
            name: 'Engenheiro',
            description: 'Salário de 5000'
        },
        89: {
            name: 'Administrador',
            description: 'Salário de 3000'
        },
        90: {
            name: 'Professor',
            description: 'Salário de 3000'
        },
        91: {
            name: 'Streamer',
            description: 'Role o dado para saber seu salário: 1-2 = 1000, 3-4 = 3000, 5-6 = 10000'
        },
        92: {
            name: 'Empreendedor',
            description: 'Role o dado para saber seu salário: 1-3: 5000, 4-5 = 8000, 6 = 12000'
        },
    }

    return cards[card_id]
}

export function isActionCard(card_id) {
    if(card_id <= 23) return true
    else return false
}

export function isBadObstacleCard(card_id) {
    if(card_id >= 24 && card_id <= 63) return true
    else return false
}

export function isBonusObstacleCard(card_id) {
    if(card_id >= 64 && card_id <= 82) return true
    else return false
}

export function isJobCard(card_id) {
    if(card_id >= 83 && card_id <= 92) return true
    else return false
}