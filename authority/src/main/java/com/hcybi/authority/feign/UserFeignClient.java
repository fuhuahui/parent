/*
 * Copyright 2018 吴汶泽(wenzewoo@gmail.com)
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.hcybi.authority.feign;

import com.hcybi.authority.feign.fallback.UserFeignClientFallback;
import com.hcybi.common.Constant;
import com.hcybi.common.entity.User;
import com.hcybi.common.web.entity.RetEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * @author by wenzewoo on 2018/2/4.
 */
@FeignClient(name = Constant.Service.FASTJEE_USERCENTER, fallback = UserFeignClientFallback.class)
public interface UserFeignClient {

    @GetMapping("/user/findByUsername/{username}")
    RetEntity<User> findByUsername(@PathVariable("username") String username);
}
