import axios from "axios";

const appUrl= import.meta.env.VITE_REACT_APP_API_URL

const axiosInstance=axios.create({
  baseURL:appUrl
})

axiosInstance.interceptors.request.use(
  config => {
      const token = sessionStorage.getItem('accessToken');
      console.log("token======>", token)
      if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
  },
  error => {
      return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken=sessionStorage.getItem("refreshToken")
                const response = await axios.post(`${appUrl}/token`, {refreshToken}, { withCredentials: true });

                
                if (response?.status === 200) {
                    sessionStorage.setItem('accessToken', response?.data?.accessToken);
                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response?.data?.accessToken;
                    return await axiosInstance(originalRequest);
                }
            } catch (tokenError) {
                if (tokenError?.response && tokenError?.response?.status === 403) {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href='/'
                }
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance