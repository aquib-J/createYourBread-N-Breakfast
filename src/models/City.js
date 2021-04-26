
module.exports=(queryInterface,DataTypes)=>{
    const city=queryInterface.define("city",{
        id:{
            type:DataTypes.NUMBER,
            primaryKey:true,
        },
        cityName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        stateId:{
            type:DataTypes.NUMBER,
            allowNull:true,
        }
    },{
        timestamps:true,
        paranoid:true,
    });

    city.associate=function(models){
        this.hasOne(models.state);
    }

    return city;
}