const { User, ChattingLog, closeDatabase } = require('./chat');


const main = async () => {
    const user = new User();
    // user.insert('M', 'seokjung');
    // user.insert('F', 'sohyeon');

    // const users = await user.findAll();
    // console.log(users);

    const log = new ChattingLog();
    // log.insert(1, 'hi sohyeon nice to meet you!');
    // log.insert(2, 'shuuttt up man');

    const logs = await log.findAll();
    console.log(logs);

    // 원하시는 배열 형태
    // const logs = await log.getLogs();
    // console.log(logs);

    // 해줘야함
    closeDatabase();
}

main();
