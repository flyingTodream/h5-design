import Mock from 'mockjs';
export default {
    //首页数据
    home:function(){
        var ret= {
            "card":{
                'user_name':Mock.Random.cname(),
                'his_card_num':Mock.Random.natural(10000)
            }
        };
        return ret;
    },
    test(){
        let data = {
            "test":{
                'user_name':Mock.Random.cname(),
                'his_card_num':Mock.Random.natural(10000)
            },"code":200
        }
        return data
    }

}