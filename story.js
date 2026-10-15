// Capítulo 1: El reloj del bisabuelo (historia original)
const STORY={
 title:'El reloj del bisabuelo',
 mystery:'¿Dónde quedó el reloj de oro del bisabuelo Aurelio?',
 days:[
 {name:'Día 1 · El baúl',letters:[
  {from:'Abuela Rosa',text:'Querida Lucía:\n\nOjalá esta carta te encuentre bien. Te escribo desde <b>Cuenca</b>, la ciudad donde nací. Quiero contarte la historia del <b>reloj de oro</b> de tu bisabuelo <b>Aurelio</b>, que se perdió hace muchos años.'},
  {from:'Abuela Rosa',text:'Tu abuelo <b>Tomás</b> y yo nos conocimos en <b>1958</b>, en la fiesta de las flores. Él vendía <b>naranjillas</b> en una carretilla azul y yo bailaba con mi vestido amarillo.'},
  {from:'Abuela Rosa',text:'El reloj lo vi por última vez el día de nuestra boda, un <b>12 de junio</b>. Esa tarde lo llevaba puesto mi hermano <b>Julio</b>, muy orgulloso.'}],
  qs:[
  {q:'¿Desde qué ciudad escribe la abuela Rosa?',a:'Cuenca',d:['Loja','Ambato','Quito','Ibarra'],h:'Es la ciudad donde nació la abuela.'},
  {q:'¿De quién era el reloj de oro?',a:'Del bisabuelo Aurelio',d:['Del abuelo Tomás','Del tío Julio','De la abuela Rosa','De Lucía'],h:'Era de alguien de la familia, de hace muchos años: un bisabuelo.'},
  {q:'¿En qué año se conocieron Rosa y Tomás?',a:'1958',d:['1962','1950','1971','1949'],h:'Fue en la fiesta de las flores, a finales de los años cincuenta.'},
  {q:'¿Qué vendía Tomás en la fiesta?',a:'Naranjillas',d:['Flores','Pan','Helados','Manzanas'],h:'Una fruta, en una carretilla azul.'},
  {q:'¿Quién llevaba el reloj el día de la boda?',a:'Julio, el hermano de Rosa',d:['Tomás, el novio','Aurelio, el bisabuelo','Carmen, la hermana','El padrino'],h:'Un hermano de la abuela, muy orgulloso.'},
  {q:'¿En qué fecha fue la boda?',a:'12 de junio',d:['3 de mayo','25 de diciembre','12 de octubre','1 de agosto'],h:'Fue a mitad de año.'}]},
 {name:'Día 2 · La casa del patio',letters:[
  {from:'Abuela Rosa',text:'Después de la boda nos mudamos a <b>Riobamba</b>, a una casa con un patio lleno de <b>geranios</b> rojos. Desde la ventana se veía el Chimborazo.'},
  {from:'Abuela Rosa',text:'Mi hermana <b>Carmen</b> vivía con nosotros. Tenía una perrita café llamada <b>Canela</b>, que escarbaba la tierra cada vez que algo le brillaba.'},
  {from:'Tío Julio',text:'Rosita: la noche de la boda hacía frío y le presté el reloj a un señor de <b>bigote</b> que quería saber la hora del baile. Perdóname, no recuerdo bien quién era.'}],
  qs:[
  {q:'¿A qué ciudad se mudaron después de la boda?',a:'Riobamba',d:['Cuenca','Guayaquil','Latacunga','Loja'],h:'Desde la ventana se veía el Chimborazo.'},
  {q:'¿Qué flores había en el patio?',a:'Geranios',d:['Rosas','Girasoles','Orquídeas','Claveles'],h:'Eran rojas y llenaban el patio.'},
  {q:'¿Cómo se llamaba la perrita?',a:'Canela',d:['Pelusa','Luna','Nieve','Chispa'],h:'Tiene nombre de especia y era café.'},
  {q:'¿De quién era la perrita?',a:'De Carmen',d:['De Rosa','De Julio','De Tomás','De Lucía'],h:'De la hermana que vivía con ellos.'},
  {q:'¿A quién le prestó Julio el reloj?',a:'A un señor de bigote',d:['A un niño','A una señora de sombrero','Al cura','A Tomás'],h:'Julio solo recuerda un detalle de su cara.'},
  {q:'¿Qué hacía la perrita cuando algo brillaba?',a:'Escarbaba la tierra',d:['Ladraba','Se escondía','Dormía','Saltaba'],h:'Tenía que ver con la tierra del patio.'}]},
 {name:'Día 3 · El señor del bigote',letters:[
  {from:'Abuela Rosa',text:'En la boda solo dos hombres tenían bigote: tu tío <b>Ernesto</b> y <b>don Pepe</b>, el panadero. Don Pepe se fue temprano, antes del baile.'},
  {from:'Tía Carmen',text:'Querida sobrina: recuerdo que el tío Ernesto dejó su <b>abrigo gris</b> colgado en el patio porque bailó tanto que tenía calor. A la mañana siguiente estaba en el suelo, junto a las flores.'},
  {from:'Abuela Rosa',text:'Ernesto siempre juró que guardó el reloj en el <b>bolsillo</b> de su abrigo. Cuando lo buscó, el bolsillo estaba vacío y tenía una pequeña <b>mordida</b>.'}],
  qs:[
  {q:'¿Quién se fue antes del baile?',a:'Don Pepe, el panadero',d:['El tío Ernesto','El tío Julio','El abuelo Tomás','El bisabuelo Aurelio'],h:'Uno de los dos señores con bigote se fue temprano.'},
  {q:'Entonces, ¿quién tenía el reloj durante el baile?',a:'El tío Ernesto',d:['Don Pepe','La tía Carmen','El abuelo Tomás','Lucía'],h:'Era el único con bigote que se quedó al baile.'},
  {q:'¿De qué color era el abrigo de Ernesto?',a:'Gris',d:['Negro','Azul','Café','Verde'],h:'Un color entre el blanco y el negro.'},
  {q:'¿Dónde guardó Ernesto el reloj?',a:'En el bolsillo del abrigo',d:['En su sombrero','En una caja','En la cocina','En su zapato'],h:'En una parte de la ropa que colgó en el patio.'},
  {q:'¿Qué tenía el bolsillo al día siguiente?',a:'Una pequeña mordida',d:['Un agujero quemado','Una flor','Barro','Nada raro'],h:'Como si un animalito lo hubiera agarrado con los dientes.'}]},
 {name:'Día 4 · El misterio',letters:[
  {from:'Abuela Rosa',text:'Lucía, ya tienes todas las pistas. Piensa en el abrigo junto a las flores, en la mordida y en quién escarbaba cuando algo brillaba...'},
  {from:'Abuela Rosa',text:'La primavera pasada, al sembrar flores nuevas en el viejo patio de <b>Riobamba</b>, mi pala tocó algo duro. ¡Era el reloj! Todavía hacía tic tac. Ahora es tuyo, mi niña. Con todo mi cariño, tu abuela Rosa.'}],
  final:true,
  qs:[
  {q:'¿Quién se llevó el reloj del bolsillo?',a:'Canela, la perrita',d:['Don Pepe','El tío Julio','La tía Carmen','Un ladrón'],h:'Alguien que muerde y que escarbaba cuando algo brillaba.',big:true},
  {q:'¿Dónde lo escondió?',a:'Bajo los geranios del patio',d:['En la panadería','En el baúl','En la iglesia','En Cuenca'],h:'El abrigo cayó junto a unas flores rojas.',big:true}]}
 ]};
