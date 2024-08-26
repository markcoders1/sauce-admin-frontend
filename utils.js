export const isURL = (url)=>{
    const re = new RegExp(
      /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-F\d]{2})+(:([\d\w]|%[a-fA-F\d]{2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-F\d]{2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-F\d]{2})=?)*)?(#([-+_~.\d\w]|%[a-fA-F\d]{2})*)?$/i
    );
      return re.test(url)
  }

  