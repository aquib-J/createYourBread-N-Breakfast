
module.exports=(queryInterface,DataTypes)=>{
    const country=queryInterface.define("coountry",{
        id:{
            type:DataTypes.NUMBER,
            primaryKey:true,
        },
        countryName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    },{
        timestamps:true,
        paranoid:true,
    });

    state.associate=function(models){
        this.hasMany(models.state);
    }

    return state;
}