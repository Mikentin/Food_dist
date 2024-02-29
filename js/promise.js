// const req = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('Подготовка данных...');
    
//         const product = {
//             name: "TV",
//             price: 2000
//         };

//         resolve(product);
//     }, 2000)
// }); 

//     req.then(product => {
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 product.status = 'order';
//                 resolve(product);
//             }, 2000);
//         }).then(product => {
//         product.modify = "true";
//         return product
//         }).then(product => {
//             console.log(product);
//         }).catch(() => {
//             console.error("Error");
//         }).finally(() => {
//             console.log("Finally")
//         })
//     });

const test = time => {
	return new Promise(resolve => {
		setTimeout(() => resolve(), time);
	});
};

const now = new Date();
// test(2000).then(() => {console.log(1000)});
   
Promise.race([test(5000), test(2000)]).then(() => {console.log(((new Date() - now) / 1000) % 60);});