const {SyncHook, AsyncSeriesHook} = require('tapable');

class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['speed']),
            brake: new SyncHook(),
            calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routes'])
        }
    }
}

const car = new Car();

// 监听（订阅）
car.hooks.brake.tap('brake', () => console.log('brake'));

car.hooks.accelerate.tap('accelerate', (speed) => console.log(`accelerate to ${speed}`));

car.hooks.calculateRoutes.tapPromise('calculateRoutes', (source, target, routes, callback) => {
    console.log('source', source);

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`${source} ${target} ${routes}`);
            resolve();
        }, 1000);
    });
});

// 执行（发布）
car.hooks.brake.call();

car.hooks.accelerate.call(100);

console.time('cost');

car.hooks.calculateRoutes.promise('async', 'hook', '666').then(() => {
    console.timeEnd('cost');
}, err => {
    console.log(err);
    console.timeEnd('cost');
});
