/**
 * 1、多选，
 * 2、getResult返回option对象数组集合，
 * 3、onChange触发时返回option对象数组集合
 * 3、refreshOption方法，更新下拉选项，传两个参数options：新的选项数组，value：初始化的value值（可不传）
 */
 (function ($) {
    //初始化参数
    var multipleSelect=function(ele,options){
        this.ele=ele;
        this.defaults={
            mult:true
        };
        this.options=$.extend({},this.defaults,options);
        this.result=[];
    };
    multipleSelect.prototype={
        init:function(){//初始化函数
            this.initOption();
            this.closeSelectEvent();
            this.addEvent();
        },
        closeSelectEvent:function(){
            var that=this;
            this.ele.find(".inputWrap").on("click",function(event){
                $('.multiple-select .inputWrap>i').each(function(index, item){
                    if($(item).hasClass("fa-angle-up")){
                        $(item).removeClass("fa-angle-up").addClass("fa-angle-down")
                    }
                })
                event.stopPropagation();
                if(that.ele.find(".inputWrap>i").hasClass("fa-angle-down")){
                    that.ele.find(".inputWrap>i").removeClass("fa-angle-down").addClass("fa-angle-up");
					$(".multiple-select-option").hide();
                    that.ele.find(".multiple-select-option").slideDown(300);
                }else{
                    that.ele.find(".inputWrap>i").removeClass("fa-angle-up").addClass("fa-angle-down");
                    that.ele.find(".multiple-select-option").slideUp(300);
                }
            });
            $("html").on("click",function(){
                that.ele.find(".inputWrap>i").removeClass("fa-angle-up").addClass("fa-angle-down");
                that.ele.find(".multiple-select-option").slideUp(300);
            })
        },
        initOption: function () {
            //初始化输入框和option
            this.ele.html("");
            this.ele.append('<div class="inputWrap"><p></p><i class="fa fa-angle-down"></i></div>');
            this.ele.append('<div class="multiple-select-option"></div>');
            for(var i= 0;i<this.options.option.length;i++){
                this.ele.find(".multiple-select-option").append('<div data-value="'+this.options.option[i].value+'" title="'+this.options.option[i].label+'">'+ '<i></i>' + this.options.option[i].label+'</div>')
            }
        },
        addEvent:function(){
            var that=this;
            this.ele.find(".multiple-select-option").on("click","div", function (event) {
                event.stopPropagation();
                if($(this).hasClass('selected')){
                    $(this).removeClass('selected')
                    for(var i = 0; i < that.result.length; i++){
                        if(that.result[i].value == $(this).attr('data-value')){
                            that.result.splice(i,1)
                        }
                    }
                }else{
                    $(this).addClass('selected')
                    that.result.push({value:$(this).attr("data-value"),label:$(this).attr("title")})
                }
                var resultTextArr = []
                $.each(that.result, function(index, item){
                    resultTextArr.push(item.label)
                })
                that.refreshInput(resultTextArr.join(','));
                if(typeof(that.options.onChange)=="function"){
                    that.options.onChange(that.result);
                }
            });
        },
        refreshOption:function(options,value){
            var that=this;
           	that.options.option=options;
           	that.ele.find(".multiple-select-option").empty();
           	for(var i= 0;i<that.options.option.length;i++){
                that.ele.find(".multiple-select-option").append('<div data-value="'+that.options.option[i].value+'" title="'+that.options.option[i].label+'">'+ '<i></i>' + that.options.option[i].label+'</div>')
            }
           	if(value!=undefined){
           		that.setResult(value);
           	}else{
           		that.setResult('');
           	}
        },
        refreshInput:function(label){
            this.ele.find(".inputWrap p").empty();
            if(this.result.value===''){
                this.ele.find(".inputWrap p").empty()
            }else{
                this.ele.find(".inputWrap p").text(label);
                this.ele.find(".inputWrap p").attr('title', label)
            }
        },
        setResult:function(res){ // 传入的参数必须是字符串,value由逗号隔开
            this.result = []
            var resArr = res.split(',')
            for(var i=0;i<this.options.option.length;i++){
            	var a=this.options.option[i].value;
                for(var j = 0; j < resArr.length; j++){
                    if(a===resArr[j] || parseInt(a)==resArr[j]){
                        this.result.push({value:resArr[j],label:this.options.option[i].label});
                    }
                }
            }
            var resultTextArr = []
            $.each(this.result, function(index, item){
                resultTextArr.push(item.label)
            })
            this.refreshInput(resultTextArr.join(','));
            var that = this
            this.ele.find(".multiple-select-option").find("div").removeClass("selected")
            for(var k = 0; k < this.result.length; k++){
                this.ele.find(".multiple-select-option").find("div").each(function(){
                    if($(this).attr("data-value")==that.result[k].value){
                        $(this).addClass("selected")
                    }
                });
            }
        },
        getResult:function(){
            return this.result;
        }
    };
    $.fn.multipleSelect=function(options){
        var select=new multipleSelect(this,options);
        select.init();
        return select;
    };
})(jQuery);