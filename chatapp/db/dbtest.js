const { User, ChattingLog, closeDatabase } = require('./chat');


const main = async () => {
    const user = new User();
    // user.insert('M', 'seokjung');
    // user.insert('F', 'sohyeon');

    // {
    //     user_id: 96,
    //     gender: 'man',
    //     nickname: 'rtyrty',
    //     user_image: 'image/littledeep_illustration_pig_style1.png',
    //     animal_type: '메기상'
    //   },
   
    // gender, nickname, user_image_path, animal_type, type
    user.insert("man", "a_man", "image/a.jpg", "메기상", "A");
    user.insert("man", "b_man", "image/a.jpg", "돼지상", "B");
    user.insert("woman", "c_woman", "image/a.jpg", "호랑이상", "B");
    user.insert("woman", "d_woman", "image/a.jpg", "호랑이상", "A");
    user.insert("man", "e_man", "image/a.jpg", "호랑이상", "C");
    
    // [Error: SQLITE_ERROR: table user has no column named type

    const users = await user.findAll();
    console.log(users);

    console.log()

    const log = new ChattingLog();
    // log.insert(1, 'hi sohyeon nice to meet you!');
    // log.insert(2, 'shuuttt up man');

    const logs = await log.findAll();
    // console.log(logs);

    // 원하시는 배열 형태
    // const logs = await log.getLogs();
    // console.log(logs);

    // 해줘야함
    closeDatabase();
}

main();
